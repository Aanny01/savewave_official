// ...existing code...
document.getElementById('searchInput').addEventListener('keyup', function(e) {
  const query = e.target.value.toLowerCase();
  // Elimina resaltados anteriores
  document.querySelectorAll('.highlight-search').forEach(el => {
    el.outerHTML = el.innerText;
  });
  if (query.length > 1) {
    // Busca en todos los textos de la página
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    while(walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue.toLowerCase().includes(query)) {
        const span = document.createElement('span');
        span.className = 'highlight-search';
        const idx = node.nodeValue.toLowerCase().indexOf(query);
        const before = node.nodeValue.slice(0, idx);
        const match = node.nodeValue.slice(idx, idx + query.length);
        const after = node.nodeValue.slice(idx + query.length);
        span.textContent = match;
        const frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));
        frag.appendChild(span);
        if (after) frag.appendChild(document.createTextNode(after));
        node.parentNode.replaceChild(frag, node);
      }
    }
  }
});
// ...existing code...
const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});