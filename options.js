document.getElementById('saveConfig').addEventListener('click', () => {
  const apiKey = document.getElementById('apiKey').value;
  const apiUrl = document.getElementById('apiUrl').value;

  chrome.storage.sync.set({ apiKey, apiUrl }, () => {
    alert('Configuración guardada correctamente.');
  });
});

// Cargar la configuración existente
window.onload = () => {
  chrome.storage.sync.get(['apiKey', 'apiUrl'], (items) => {
    if (items.apiKey) {
      document.getElementById('apiKey').value = items.apiKey;
    }
    if (items.apiUrl) {
      document.getElementById('apiUrl').value = items.apiUrl;
    }
  });
};
