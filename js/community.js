(function () {
  const API =
    "https://unverified-file-privacy-api.nullrecords.workers.dev/api/v1/community";
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const key = (type, id) => `${type}:${id}`;

  async function summaries(targets) {
    if (!targets.length) return new Map();
    const response = await fetch(
      `${API}?targets=${encodeURIComponent(targets.map((target) => key(target.type, target.id)).join(","))}`,
    );
    if (!response.ok) throw new Error("Community totals are unavailable");
    const data = await response.json();
    return new Map(
      data.items.map((item) => [key(item.target_type, item.target_id), item]),
    );
  }

  function totalsMarkup(item = {}) {
    return `<span title="Community real votes">✓ ${Number(item.real_votes || 0).toLocaleString()} real</span><span title="Community hoax votes">? ${Number(item.hoax_votes || 0).toLocaleString()} hoax</span><span title="Published comments">◌ ${Number(item.comment_count || 0).toLocaleString()} comments</span>`;
  }

  async function fillTotals(root = document) {
    const nodes = [...root.querySelectorAll("[data-community-totals]")];
    const targets = nodes
      .map((node) => ({
        type: node.dataset.targetType,
        id: node.dataset.targetId,
      }))
      .filter((target) => target.type && target.id);
    if (!targets.length) return;
    try {
      const data = await summaries(targets);
      nodes.forEach((node) => {
        node.innerHTML = totalsMarkup(
          data.get(key(node.dataset.targetType, node.dataset.targetId)),
        );
      });
    } catch (_) {
      nodes.forEach((node) => {
        node.textContent = "Community totals unavailable";
      });
    }
  }

  function wireVoteButtons(root = document) {
    root.querySelectorAll("[data-community-vote-group]").forEach((group) => {
      if (group.dataset.communityVoteReady === "true") return;
      const type = group.dataset.targetType;
      const id = group.dataset.targetId;
      const buttons = [...group.querySelectorAll("[data-community-vote]")];
      const status = group.querySelector("[data-community-vote-status]");
      if (!type || !id || !buttons.length) return;
      group.dataset.communityVoteReady = "true";
      buttons.forEach((button) =>
        button.addEventListener("click", async () => {
          buttons.forEach((item) => (item.disabled = true));
          if (status) status.textContent = "Saving…";
          try {
            const response = await fetch(
              `${API}/${type}/${encodeURIComponent(id)}/vote`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vote: button.dataset.communityVote }),
              },
            );
            if (!response.ok) throw new Error("Vote was not saved");
            const data = await response.json();
            root
              .querySelectorAll(
                `[data-community-totals][data-target-type="${type}"][data-target-id="${id}"]`,
              )
              .forEach((node) => (node.innerHTML = totalsMarkup(data)));
            buttons.forEach((item) =>
              item.classList.toggle(
                "is-selected",
                item.dataset.communityVote === button.dataset.communityVote,
              ),
            );
            if (status) status.textContent = "Vote saved";
          } catch (error) {
            if (status) status.textContent = error.message;
          } finally {
            buttons.forEach((item) => (item.disabled = false));
          }
        }),
      );
    });
  }

  function mount(options) {
    const host =
      typeof options.host === "string"
        ? document.querySelector(options.host)
        : options.host;
    if (!host) return;
    const type = options.type;
    const id = options.id;
    host.classList.add("community-panel");
    host.innerHTML = `<div class="community-heading"><div><p class="community-kicker">Community review</p><h2>Vote and discuss</h2><p>Votes are signals, not factual findings.</p></div><div class="community-totals" data-summary></div></div><div class="community-votes"><button type="button" data-vote="real">✓ Vote real</button><button type="button" data-vote="hoax">? Vote hoax</button></div><div class="community-bar" aria-hidden="true"><span></span></div><section class="community-comments"><h3>Comments <span data-comment-count></span></h3><div data-comments><p class="community-muted">Loading comments…</p></div><form data-comment-form><label>Display name<input name="author_name" maxlength="80" required></label><label>Comment<textarea name="body" maxlength="2000" rows="4" required></textarea></label><input class="community-honeypot" name="website" tabindex="-1" autocomplete="off"><fieldset><legend>Verification</legend><label><input type="radio" name="verification" value="spam" checked> Pass a spam test</label><label><input type="radio" name="verification" value="social"> Verify Bluesky, X, or Reddit</label></fieldset><div data-spam-test></div><div data-social hidden><label>Network<select name="social_provider"><option value="bluesky">Bluesky</option><option value="x">X</option><option value="reddit">Reddit</option></select></label><label>Short-lived account access token<input name="social_token" type="password" autocomplete="off"></label><p class="community-muted">Used once to confirm the account and never stored.</p></div><button type="submit">Post verified comment</button><p data-form-status class="community-muted" role="status"></p></form></section>`;
    const commentsNode = host.querySelector("[data-comments]");
    const statusNode = host.querySelector("[data-form-status]");
    let turnstileWidget = null;

    const render = (data) => {
      host.querySelector("[data-summary]").innerHTML = totalsMarkup(data);
      host.querySelector("[data-comment-count]").textContent =
        `(${data.comment_count || 0})`;
      const total = Number(data.total_votes || 0);
      host.querySelector(".community-bar span").style.width =
        `${total ? (Number(data.real_votes || 0) / total) * 100 : 50}%`;
      commentsNode.innerHTML = data.comments?.length
        ? data.comments
            .map(
              (comment) =>
                `<article><div><strong>${esc(comment.author_name)}</strong><span>${esc(comment.verification_method === "turnstile" ? "spam checked" : `verified on ${comment.verification_method}`)}${comment.verified_account ? ` · @${esc(comment.verified_account)}` : ""}</span></div><p>${esc(comment.body).replace(/\n/g, "<br>")}</p><time datetime="${esc(comment.created_at)}">${new Date(comment.created_at).toLocaleString()}</time></article>`,
            )
            .join("")
        : '<p class="community-muted">No comments yet. Start the evidence-minded discussion.</p>';
    };
    const load = async () => {
      const response = await fetch(`${API}/${type}/${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error("Community discussion is unavailable");
      const data = await response.json();
      render(data);
      if (data.turnstile_site_key) setupTurnstile(data.turnstile_site_key);
      else
        host.querySelector("[data-spam-test]").innerHTML =
          '<p class="community-muted">Spam test is not configured. Use social verification.</p>';
    };
    const setupTurnstile = (siteKey) => {
      const draw = () => {
        if (turnstileWidget === null && window.turnstile)
          turnstileWidget = window.turnstile.render(
            host.querySelector("[data-spam-test]"),
            { sitekey: siteKey, theme: "dark" },
          );
      };
      if (window.turnstile) return draw();
      if (!document.querySelector("script[data-community-turnstile]")) {
        const script = document.createElement("script");
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.dataset.communityTurnstile = "";
        script.onload = draw;
        document.head.appendChild(script);
      } else setTimeout(draw, 250);
    };
    host.querySelectorAll("[data-vote]").forEach((button) =>
      button.addEventListener("click", async () => {
        button.disabled = true;
        try {
          const response = await fetch(
            `${API}/${type}/${encodeURIComponent(id)}/vote`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ vote: button.dataset.vote }),
            },
          );
          if (!response.ok) throw new Error("Vote was not saved");
          render({
            ...(await response.json()),
            comments: [...commentsNode.querySelectorAll("article")].length
              ? undefined
              : [],
          });
          await load();
        } catch (error) {
          statusNode.textContent = error.message;
        } finally {
          button.disabled = false;
        }
      }),
    );
    host.querySelectorAll('input[name="verification"]').forEach((radio) =>
      radio.addEventListener("change", () => {
        const social = radio.form.elements.verification.value === "social";
        host.querySelector("[data-social]").hidden = !social;
        host.querySelector("[data-spam-test]").hidden = social;
      }),
    );
    host
      .querySelector("[data-comment-form]")
      .addEventListener("submit", async (event) => {
        event.preventDefault();
        statusNode.textContent = "Checking and posting…";
        const form = event.currentTarget;
        const values = new FormData(form);
        const social = values.get("verification") === "social";
        const payload = {
          author_name: values.get("author_name"),
          body: values.get("body"),
          website: values.get("website"),
        };
        if (social) {
          payload.social_provider = values.get("social_provider");
          payload.social_token = values.get("social_token");
        } else
          payload.turnstile_token =
            window.turnstile && turnstileWidget !== null
              ? window.turnstile.getResponse(turnstileWidget)
              : "";
        try {
          const response = await fetch(
            `${API}/${type}/${encodeURIComponent(id)}/comments`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            },
          );
          const data = await response.json().catch(() => ({}));
          if (!response.ok)
            throw new Error(
              {
                verification_required: "Please complete a verification method.",
                spam_test_failed: "The spam test did not pass.",
                social_verification_failed:
                  "That social account could not be verified.",
                rate_limited: "Too many comments; please try again later.",
              }[data.error] || "Comment was not posted",
            );
          form.reset();
          statusNode.textContent = "Comment posted.";
          if (window.turnstile && turnstileWidget !== null)
            window.turnstile.reset(turnstileWidget);
          await load();
        } catch (error) {
          statusNode.textContent = error.message;
        }
      });
    load().catch((error) => {
      commentsNode.innerHTML = `<p class="community-muted">${esc(error.message)}</p>`;
    });
  }

  window.UnverifiedCommunity = Object.freeze({
    mount,
    fillTotals,
    wireVoteButtons,
    summaries,
    totalsMarkup,
  });
})();
