// ============================================================
//  Arbre décisionnel dynamique — arbre.js
// ============================================================

const DATA = {

    start: {
      type: 'question',
      progress: 5,
      label: 'Situation observée',
      text: 'Quelle difficulté de communication observez-vous chez votre proche\u00a0?',
      choices: [
        {
          icon: '🔑',
          label: 'N\'arrive pas à ressortir un prénom ou un objet qu\'il connait',
          desc: 'Votre proche cherche ses mots ou ne retrouve plus les noms',
          next: 'oubli'
        },
        {
          icon: '💬',
          label: 'Abandon des phrases en cours',
          desc: 'Les phrases restent inachevées, le fil est perdu',
          next: 'abandon'
        },
        {
          icon: '🤫',
          label: 'Silence / préfère ne pas parler',
          desc: 'Votre proche se retire de la conversation',
          next: 'silence'
        },
        {
          icon: '🔄',
          label: 'Utilisation de périphrases (définition du mot)',
          desc: 'Ex.\u00a0: «\u00a0le truc qui sert à ouvrir la porte\u00a0»',
          next: 'periphrases'
        },
        {
          icon: '🚫',
          label: 'Refus d\'aide',
          desc: 'Votre proche décline l\'assistance proposée',
          next: 'refus'
        }
      ]
    },
  
    oubli: {
      type: 'result',
      progress: 60,
      title: 'N\'arrive pas à ressortir un prénom ou un objet qu\'il connait',
      badge: 'Mémoire du langage',
      desc: 'Cette difficulté relève de l\'anomie\u00a0: la connexion entre la pensée et le mot est fragilisée. Plusieurs stratégies permettent de maintenir la fluidité de l\'échange.',
      video: {
        num: 1,
        title: 'Vidéo 1 — Ne parvient pas à ressortir un prénom ou un nom d\'objet qu\'il connait',
        sub: 'Stratégies pratiques au quotidien',
        src: 'video1.MP4'
      },
      strategies: [
        'Laisser du temps',
        'L ébauche phonologique',
        'étiquettes sur les objets les plus utilisés',
        'Albums photos avec les mots/prénoms écrits',
      ]
    },

  
    abandon: {
      type: 'result',
      progress: 60,
      title: 'Abandon des phrases en cours',
      badge: 'Cohérence du discours',
      desc: 'Votre proche perd le fil de sa pensée en cours d\'expression. Il est important de ne pas précipiter la fin de sa phrase à sa place, mais de l\'accompagner avec douceur.',
      video: {
        num: 2,
        title: 'Vidéo 2 — Accompagner les phrases inachevées',
        sub: 'Maintenir le lien sans interrompre'
      },
      strategies: [
        'Poser des questions fermées',
        'Reformuler les propos',
        'Proposer plusieurs mots',
      ]
    },
  
    silence: {
      type: 'result',
      progress: 60,
      title: 'Silence / préfère ne pas parler',
      badge: 'Communication verbale et non-verbale',
      desc: 'Le silence peut être protecteur ou exprimer un inconfort. L\'enjeu est de maintenir la présence et le lien sans forcer la parole.',
      video: {
        num: 3,
        title: 'Vidéo 3 — La communication par le silence',
        sub: 'Présence et non-verbal'
      },
      strategies: [
        'Poser des questions fermées',
        'Proposer des choix visuels',
      ]
    },
  
    periphrases: {
      type: 'result',
      progress: 60,
      title: 'Utilisation de périphrases',
      badge: 'Stratégies compensatoires',
      desc: 'Les périphrases sont une adaptation spontanée de votre proche\u00a0: il décrit ce qu\'il ne peut plus nommer. C\'est une ressource à valoriser, non une erreur à corriger.',
      video: {
        num: 4,
        title: 'Vidéo 4 — Comprendre et valoriser les périphrases',
        sub: 'Décoder et accompagner'
      },
      strategies: [
        'Soutenir la périphrase, la valider et proposer plusieurs mots',
        'ébauche phonologique',
      ]
    },
  
    refus: {
      type: 'result',
      progress: 60,
      title: 'Refus d\'aide',
      badge: 'Autonomie et relation',
      desc: 'Le refus d\'aide est souvent une défense de l\'identité et de l\'autonomie. Comprendre ce qui est refusé et par qui aide à ajuster l\'approche.',
      video: {
        num: 5,
        title: 'Vidéo 5 — Comprendre et désamorcer le refus',
        sub: 'Respecter l\'autonomie'
      },
      strategies: [
        'Accepter le refus et changer de sujet',
        'Redonner le sentiment de contrôle',
      ]
    },
  };
  
  // ── Navigation ────────────────────────────────────────────
  let history = ['start'];
  
  function currentStep() { return history[history.length - 1]; }
  
  function render() {
    const key  = currentStep();
    const node = DATA[key];
    const bc   = document.getElementById('breadcrumb');
    const pf   = document.getElementById('progress-fill');
    const sc   = document.getElementById('step-container');
  
    pf.style.width = (node.progress || 0) + '%';
  
    bc.innerHTML = '';
    if (history.length > 1) {
      history.forEach((k, i) => {
        if (i === history.length - 1) return;
        const n = DATA[k];
        const label = i === 0
          ? 'Accueil'
          : (n.title ? n.title.split(' ').slice(0, 3).join(' ') + '…' : n.label || '');
        const sp = document.createElement('span');
        sp.textContent = label;
        sp.onclick = () => { history = history.slice(0, i + 1); render(); };
        bc.appendChild(sp);
        const sep = document.createElement('span');
        sep.className = 'sep';
        sep.textContent = ' › ';
        bc.appendChild(sep);
      });
      const cur = document.createElement('span');
      cur.className = 'bc-current';
      cur.textContent = node.title || node.label || '';
      bc.appendChild(cur);
    }
  
    sc.innerHTML = '';
  
    if (node.type === 'question') {
      const ql = document.createElement('div');
      ql.className = 'question-label';
      ql.textContent = node.label;
  
      const qt = document.createElement('div');
      qt.className = 'question-text';
      qt.textContent = node.text;
  
      const grid = document.createElement('div');
      grid.className = 'choices-grid';
  
      node.choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerHTML = `
          <div class="choice-icon">${c.icon}</div>
          <div class="choice-body">
            <div class="choice-label">${c.label}</div>
            <div class="choice-desc">${c.desc}</div>
          </div>`;
        btn.onclick = () => { history.push(c.next); render(); };
        grid.appendChild(btn);
      });
  
      sc.appendChild(ql);
      sc.appendChild(qt);
      sc.appendChild(grid);
  
    } else if (node.type === 'result') {
      const card = document.createElement('div');
      card.className = 'result-card';
  
      const badge = document.createElement('div');
      badge.className = 'result-badge';
      badge.textContent = node.badge;
  
      const title = document.createElement('div');
      title.className = 'result-title';
      title.textContent = node.title;
  
      const desc = document.createElement('div');
      desc.className = 'result-desc';
      desc.textContent = node.desc;
  
      const vb = document.createElement('div');
      vb.className = 'video-block';
      vb.innerHTML = node.video.src
     ? `<video controls style="width:100%; max-height:300px; border-radius:9px;">
           <source src="${node.video.src}" type="video/mp4">
         </video>`
      : `<div class="video-thumb"><div class="play-icon"></div></div>
         <div class="video-info">
           <div class="video-title">${node.video.title}</div>
           ${node.video.sub ? `<div class="video-sub">${node.video.sub}</div>` : ''}
         </div>`;
  
      const slbl = document.createElement('div');
      slbl.className = 'strategies-label';
      slbl.textContent = 'Stratégies suggérées';
  
      const sg = document.createElement('div');
      sg.className = 'strategies-grid';
      node.strategies.forEach(s => {
        const p = document.createElement('div');
        p.className = 'strat-pill';
        p.textContent = s;
        sg.appendChild(p);
      });
  
      card.appendChild(badge);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(vb);
      card.appendChild(slbl);
      card.appendChild(sg);
  
      if (node.sub) {
        const ss = document.createElement('div');
        ss.className = 'sub-section';
  
        const slb2 = document.createElement('div');
        slb2.className = 'sub-label';
        slb2.textContent = node.sub.label;
  
        const sc2 = document.createElement('div');
        sc2.className = 'sub-choices';
  
        node.sub.choices.forEach(c => {
          const btn = document.createElement('button');
          btn.className = 'sub-btn';
          btn.innerHTML = `<div class="sub-arrow">›</div><span>${c.label}</span>`;
          btn.onclick = () => { history.push(c.next); render(); };
          sc2.appendChild(btn);
        });
  
        ss.appendChild(slb2);
        ss.appendChild(sc2);
        card.appendChild(ss);
      }
  
      sc.appendChild(card);
  
      const ar = document.createElement('div');
      ar.className = 'actions-row';
  
      if (history.length > 1) {
        const bb = document.createElement('button');
        bb.className = 'btn-back';
        bb.textContent = '← Retour';
        bb.onclick = () => { history.pop(); render(); };
        ar.appendChild(bb);
      }
  
      const rb = document.createElement('button');
      rb.className = 'btn-restart';
      rb.textContent = 'Recommencer';
      rb.onclick = () => { history = ['start']; render(); };
      ar.appendChild(rb);
  
      sc.appendChild(ar);
    }
  }
  
  render();