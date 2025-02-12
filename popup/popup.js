document.addEventListener('DOMContentLoaded', function() {
  const fillButton = document.getElementById("fillTextarea");
  const copyButton = document.getElementById("copyToClipboard");
  const promptOutput = document.getElementById("promptOutput");
  const aspectRatioSelect = document.getElementById("aspectRatio");
  const chaosRange = document.getElementById("chaosRange");
  const chaosValue = document.getElementById("chaosValue");
  const srefInput = document.getElementById("srefInput");
  const randomizeCheckbox = document.getElementById("randomizeCheckbox");
  const repeatRange = document.getElementById("repeatRange");
  const repeatValue = document.getElementById("repeatValue");
  const userPromptInput = document.getElementById("userPromptInput");
  const randomPromptCheckbox = document.getElementById("randomPromptCheckbox");

  console.log("Test");

  if (fillButton) {
    console.log("Botón 'fillTextarea' encontrado.");
    fillButton.addEventListener("click", () => {
      console.log("Botón 'fillTextarea' clickeado.");
      
      const userPrompt = randomPromptCheckbox.checked 
        ? "Generate a random Niji prompt" 
        : `Generate a Niji prompt for ${userPromptInput.value}`;

      // Obtener apiKey y apiUrl de chrome.storage
      chrome.storage.sync.get(['apiKey', 'apiUrl'], (items) => {
        const apiKey = items.apiKey;
        const apiUrl = items.apiUrl;

        if (!apiKey || !apiUrl) {
          console.error('API Key o URL de la API no configurada.');
          return;
        }

        console.log("API Key:", apiKey, "API URL:", apiUrl);

        // Enviar mensaje con los datos correctos después de obtenerlos
        chrome.runtime.sendMessage(
          { action: "getRandomTag", userPrompt: userPrompt, apiKey: apiKey, apiUrl: apiUrl }, 
          function(response) {
            console.log("Respuesta recibida del background script:", response);

            if (response && response.tags) {
              console.log("Tags obtenidos:", response.tags);
              const selectedAspectRatio = aspectRatioSelect.value;
              const selectedChaos = chaosRange.value;
              const selectedSref = randomizeCheckbox.checked ? "random" : srefInput.value;
              const selectedRepeat = repeatRange.value;

              const promptWithParameters = 
                `${response.tags} --ar ${selectedAspectRatio} --chaos ${selectedChaos} --sref ${selectedSref} --repeat ${selectedRepeat}`;
              
              promptOutput.value = promptWithParameters;
            } else {
              console.error('Error al obtener tags:', response?.error);
            }
          }
        );
      });
    });
  } else {
    console.error("No se encontró el botón 'fillTextarea'");
  }

  if (copyButton) {
    copyButton.addEventListener("click", () => {
      promptOutput.select();
      document.execCommand("copy");
      console.log("Texto copiado al portapapeles.");
    });
  } else {
    console.error("No se encontró el botón 'copyToClipboard'");
  }

  if (chaosRange) {
    chaosRange.addEventListener("input", () => {
      chaosValue.textContent = chaosRange.value;
    });
  }

  if (randomizeCheckbox) {
    randomizeCheckbox.addEventListener("change", () => {
      srefInput.disabled = randomizeCheckbox.checked;
    });
  }

  if (repeatRange) {
    repeatRange.addEventListener("input", () => {
      repeatValue.textContent = repeatRange.value;
    });
  }

  if (randomPromptCheckbox) {
    randomPromptCheckbox.addEventListener('change', function() {
      userPromptInput.disabled = this.checked;
    });
  }
});