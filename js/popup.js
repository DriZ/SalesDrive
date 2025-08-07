const langToggleBtn = document.getElementById("langToggleBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");
let currentLang = "ua";

const hiddenFileInput = document.createElement('input');
hiddenFileInput.type = 'file';
hiddenFileInput.accept = '.json';
hiddenFileInput.style.display = 'none';
document.body.appendChild(hiddenFileInput);

async function getStorageArea() {
	try {
		await chrome.storage.sync.get(null);
		return chrome.storage.sync;
	} catch {
		console.warn("sync недоступен, используем local");
		return chrome.storage.local;
	}
}

themeToggleBtn.addEventListener("click", () => {
	document.body.classList.toggle("dark-theme");
	const isDark = document.body.classList.contains("dark-theme");
	getStorageArea().then(storage => storage.set({ theme: isDark ? "dark" : "light" }));
});

const translations = {
	ua: {
		toggleKeysBtn: "Показати збережені ключі ⬇",
		hideKeys: "Сховати збережені ключі ⬆",
		showMessageSuccess: "Ключ збережено",
		showMessageError: "Невірний API-ключ",
		langToggleBtn: "🇷🇺 Сменить язык",
		addApiKeyText: "Додати API-ключ",
		saveBtn: "Зберегти",
		clearAllBtn: "Видалити всі ключі",
		exportBtn: "📤 Експорт JSON",
		importBtn: "📥 Імпорт JSON",
		keyNameText: "Назва ключа",
		keyNamePlaceholder: "Введіть зрозуміле ім’я ключа",
		formIdPlaceholder: "Заповниться автоматично",
		previewText: "Перегляд ключів:",
		selectAllBtn: "Обрати всі",
		deselectAllBtn: "Зняти всі",
		confirmImportBtn: "Імпортувати обрані",
		cancelImportBtn: "Відмінити",
		themeToggleBtn: "🌙 Змінити тему",
		invalidKey: "Невірний ключ",
		errWhileExtractKey: "Помилка при видобутті formId",
		succKeySaved: "Ключ успішно збережено.",
		allKeysCleared: "Всі ключі успішно очищені.",
		selectJsonFile: "Виберіть JSON-файл для импорту.",
		errWhileReadJson: "Помилка при читанні JSON-файлу.",
		edit: "Редагувати",
		delete: "Видалити",
		enterValidKey: "Введіть дійсний ключ (100 символів).",
		importedKeysSaved: "Обрані ключі успішно імпортовані.",
	},
	ru: {
		toggleKeysBtn: "Показать сохранённые ключи ⬇",
		hideKeys: "Скрыть сохранённые ключи ⬆",
		showMessageSuccess: "Ключ сохранён",
		showMessageError: "Неверный API-ключ",
		langToggleBtn: "🇺🇦 Змінити мову",
		addApiKeyText: "Добавить API-ключ",
		saveBtn: "Сохранить",
		clearAllBtn: "Удалить все ключи",
		exportBtn: "📤 Экспорт JSON",
		importBtn: "📥 Импорт JSON",
		keyNameText: "Имя ключа",
		keyNamePlaceholder: "Введите понятное имя ключа",
		formIdPlaceholder: "Заполнится автоматически",
		previewText: "Предпросмотр ключей:",
		selectAllBtn: "Выбрать все",
		deselectAllBtn: "Снять все",
		confirmImportBtn: "Импортировать выбранные",
		cancelImportBtn: "Отмена",
		themeToggleBtn: "🌙 Сменить тему",
		invalidKey: "Неверный ключ",
		errWhileExtractKey: "Ошибка при извлечении formId",
		succKeySaved: "Ключ успешно сохранен.",
		allKeysCleared: "Все ключи успешно очищены.",
		selectJsonFile: "Выберите JSON-файл для импорта.",
		errWhileReadJson: "Ошибка при чтении JSON-файла.",
		edit: "Редактировать",
		delete: "Удалить",
		enterValidKey: "Введите действительный ключ (100 символов).",
		importedKeysSaved: "Выбранные ключи успешно импортированы.",
	}
};

function updateLanguage() {
	const t = translations[currentLang];

	for (let key in t) {
		// Обработка placeholder
		if (key.endsWith("Placeholder")) {
			const inputId = key.replace("Placeholder", "");
			const inputEl = document.getElementById(inputId);
			if (inputEl) inputEl.setAttribute("placeholder", t[key]);
			continue;
		}

		// Обработка обычного текста
		const el = document.getElementById(key);
		if (el) el.textContent = t[key];
	}

	// Обновляем toggleKeysBtn по классу
	const toggleBtn = document.getElementById("toggleKeysBtn");
	if (toggleBtn) {
		const isHidden = toggleBtn.classList.contains("hide");
		toggleBtn.textContent = isHidden ? t.toggleKeysBtn : t.hideKeys;
	}
}

langToggleBtn.addEventListener("click", () => {
	currentLang = currentLang === "ua" ? "ru" : "ua";
	getStorageArea().then(storage => storage.set({ selectedLang: currentLang }))
	updateLanguage();
});

function showStatusMessage(message, type = "info") {
	const box = document.getElementById("statusMessage");
	const icon = document.getElementById("statusIcon");
	const text = document.getElementById("statusText");

	text.textContent = message;

	if (type === "error") {
		box.style.backgroundColor = "#f8d7da";
		box.style.color = "#842029";
		box.style.border = "1px solid #f5c2c7";
		icon.textContent = "❌";
	} else {
		box.style.backgroundColor = "#d1e7dd";
		box.style.color = "#0f5132";
		box.style.border = "1px solid #badbcc";
		icon.textContent = "✅";
	}

	box.style.opacity = "1";
	box.style.display = "block";

	setTimeout(() => {
		box.style.opacity = "0";
		setTimeout(() => {
			box.style.display = "none";
		}, 300); // после исчезновения
	}, 5000);
}

function editKey(id) {
  	getStorageArea().then(storage => {
    	storage.get({ apiKeys: {} }).then(({ apiKeys }) => {
      		const current = apiKeys[id];
      		const newName = prompt("Новое имя:", current.name);
      		const newKey = prompt("Новый API-ключ:", current.key);
      		if (newName && newKey) {
        		apiKeys[id] = { name: newName, key: newKey };
        		storage.set({ apiKeys }).then(() => renderKeys(apiKeys));
      		}
    	});
  	});
}

function deleteKey(id) {
  	getStorageArea().then(storage => {
    	storage.get({ apiKeys: {} }).then(({ apiKeys }) => {
      		delete apiKeys[id];
      		storage.set({ apiKeys }).then(() => renderKeys(apiKeys));
    	});
  	});
}

function renderKeys(apiKeys = null) {
  	getStorageArea().then(storage => {
    	const list = document.getElementById("keysList");
    	list.innerHTML = "";

    	const showKeys = (data) => {
	      	const keys = apiKeys || data.apiKeys;
	      	for (const [id, { name, key }] of Object.entries(keys)) {
	        	const item = document.createElement("div");
	        	item.className = "key-item";
	        	item.style.display = "flex";
	        	item.style.alignItems = "center";
		        item.style.justifyContent = "space-between";
		        item.style.gap = "12px";

		        const infoBlock = document.createElement("div");
		        infoBlock.innerHTML = `<strong>${name}</strong> <small>(formId ${id})</small><br><span><code>${key.slice(0, 18)}***</code></span>`;

		        const actionsBlock = document.createElement("div");
		        actionsBlock.style.display = "flex";
		        actionsBlock.style.gap = "6px";

		        const editBtn = document.createElement("button");
		        editBtn.className = "btn btn-outline-secondary editBtn";
		        editBtn.title = translations[currentLang].edit;
		        editBtn.innerHTML = `<i class="fa fa-pen"></i>`;
		        editBtn.onclick = () => editKey(id);

		        const deleteBtn = document.createElement("button");
		        deleteBtn.className = "btn btn-outline-danger deleteBtn";
		        deleteBtn.title = translations[currentLang].delete;
		        deleteBtn.innerHTML = `<i class="fa fa-trash"></i>`;
		        deleteBtn.onclick = () => deleteKey(id);

		        actionsBlock.appendChild(editBtn);
		        actionsBlock.appendChild(deleteBtn);
		        item.appendChild(infoBlock);
		        item.appendChild(actionsBlock);
		        list.appendChild(item);
	      	}
    	};

	    if (apiKeys) showKeys({ apiKeys });
	    else storage.get({ apiKeys: {} }).then(showKeys);
  	});
}

document.addEventListener("DOMContentLoaded", () => {
	getStorageArea().then(storage => {
		storage.get(["selectedLang", "theme"], (result) => {
			currentLang = result.selectedLang || (navigator.language.startsWith("uk") ? "ua" : "ru");
			if (result.theme === "dark") document.body.classList.add("dark-theme");
			updateLanguage();
		});
	});

	const formIdEl = document.getElementById("formId");
  	const apiKeyEl = document.getElementById("apiKey");
  	const keyNameEl = document.getElementById("keyName");

	let apiKeyTimer = null;

	apiKeyEl.addEventListener("input", () => {
		clearTimeout(apiKeyTimer);
		const apiKey = apiKeyEl.value.trim();
		if (apiKey.length === 0) {
			apiKeyEl.classList.remove("is-invalid");
		} else if (apiKey.length < 100) {
			apiKeyEl.classList.add("is-invalid");
			return;
		} // минимальная длина для проверки

		apiKeyTimer = setTimeout(async () => {
			const formId = await extractFormInfo(apiKey);
			if (formId) {
				formIdEl.value = formId;
				apiKeyEl.classList.remove("is-invalid");
				apiKeyEl.classList.add("is-valid");
				updateSaveButtonState();
				keyNameEl.focus();
			} else {
				formIdEl.value = "";
				updateSaveButtonState();
			}
		}, 600); // задержка 600 мс после ввода
	});

	async function extractFormInfo(apiKey) {
		try {
			const response = await fetch("https://kompikok.salesdrive.me/api/order/list/?limit=1", {
				method: "GET",
				headers: {
					"Form-Api-Key": apiKey
				}
			});

			if (!response.ok) throw new Error(translations[currentLang].invalidKey);

			const linkHeader = response.headers.get("Link");
			if (!linkHeader) throw new Error(translations[currentLang].invalidKey);

			const matchFormId = linkHeader.match(/formId=([^&]+)/);
			return matchFormId?.[1] || null;
		} catch (e) {
			showStatusMessage(`${translations[currentLang].errWhileExtractKey}: ${e.message}`, "error")
			return null;
		}
	}

	function updateSaveButtonState() {
		const formIdFilled = formIdEl.value.trim() !== "";
		const keyNameFilled = (keyNameEl.value.trim() !== "" && keyNameEl.value.trim().length > 2);
		saveBtn.disabled = !(formIdFilled && keyNameFilled);
	}

	keyNameEl.addEventListener("input", () => {
		const keyName = keyNameEl.value.trim();
		if (keyName.length < 3) {
			updateSaveButtonState();
			keyNameEl.classList.add("is-invalid");
		} else {
			updateSaveButtonState();
			keyNameEl.classList.replace("is-invalid", "is-valid");
		}
	});

	const toggleBtn = document.getElementById("toggleKeysBtn");
	const keysList = document.getElementById("keysList");

	toggleBtn.addEventListener("click", () => {
		const isVisible = keysList.style.maxHeight !== "0px";

		if (isVisible) {
			keysList.style.maxHeight = "0px";
			keysList.style.opacity = "0";
			toggleBtn.textContent = "Показать сохранённые ключи ⬇";
			toggleBtn.classList.replace("show", "hide");
		} else {
			const scrollHeight = keysList.scrollHeight;
			keysList.style.maxHeight = scrollHeight + "px";
			keysList.style.opacity = "1";
			toggleBtn.textContent = "Скрыть сохранённые ключи ⬆";
			toggleBtn.classList.replace("hide", "show");
		}

		const isHidden = toggleBtn.classList.contains("hide");

		toggleBtn.classList.toggle("hide");
		toggleBtn.classList.toggle("show");

		toggleBtn.textContent = !isHidden
			? translations[currentLang].hideKeys
			: translations[currentLang].toggleKeysBtn;

		keysList.classList.toggle("open");
	});

	langToggleBtn.addEventListener("click", () => {
		let editBtns = document.querySelectorAll(".editBtn");
		editBtns.forEach(editBtn => editBtn.title = translations[currentLang].edit);
		let deleteBtns = document.querySelectorAll(".deleteBtn");
		deleteBtns.forEach(deleteBtn => deleteBtn.title = translations[currentLang].delete);
	});

	const saveBtn = document.getElementById("saveBtn")
	saveBtn.addEventListener("click", () => {
    	const formId = formIdEl.value.trim();
    	const apiKey = apiKeyEl.value.trim();
    	const keyName = keyNameEl.value.trim();

    	if (!formId || !apiKey || !keyName) return;

    	getStorageArea().then(storage => {
	      	storage.get({ apiKeys: {} }).then(({ apiKeys }) => {
	        	apiKeys[formId] = { name: keyName, key: apiKey };
	        	storage.set({ apiKeys }).then(() => {
	          		formIdEl.value = "";
	          		apiKeyEl.value = "";
	          		keyNameEl.value = "";
	          		renderKeys(apiKeys);
	        	});
	      	});
	    });

		showStatusMessage(translations[currentLang].succKeySaved, "success")
		apiKeyEl.focus();
  	});

	keyNameEl.addEventListener("keydown", (e) => {
		if (e.key === "Enter" && !saveBtn.disabled) {
			e.preventDefault(); // предотвращаем отправку формы
			saveBtn.click();    // имитируем нажатие кнопки
		}
	});

	document.getElementById("clearAllBtn").addEventListener("click", () => {
  		if (!confirm(translations[currentLang].removeAllApiKeys)) return;
    	getStorageArea().then(storage => storage.set({ apiKeys: {} }).then(() => renderKeys({})));
		showStatusMessage(translations[currentLang].allKeysCleared, "success")
  	});

  	document.getElementById("exportBtn").addEventListener("click", () => {
    	getStorageArea().then(storage => {
      		storage.get({ apiKeys: {} }).then(({ apiKeys }) => {
		        const blob = new Blob([JSON.stringify(apiKeys, null, 2)], { type: "application/json" });
		        const url = URL.createObjectURL(blob);
		        const a = document.createElement("a");
		        a.href = url;
		        a.download = "apiKeys.json";
		        a.click();
		        URL.revokeObjectURL(url);
      		});
    	});
  	});

  	document.getElementById("importBtn").addEventListener("click", () => {
		hiddenFileInput.click();
  	});

	hiddenFileInput.addEventListener('change', (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const parsed = JSON.parse(e.target.result);
				showPreview(parsed); // твоя функция предпросмотра
			} catch (err) {
				console.error('Ошибка при парсинге JSON:', err);
				// можно показать сообщение об ошибке
			}
		};
		reader.readAsText(file);
	});

	renderKeys();

  	let previewData = null;

	function showPreview(importedKeys) {
	  	getStorageArea().then(storage => {
	    	storage.get({ apiKeys: {} }).then(({ apiKeys: existingKeys }) => {
	      		const container = document.getElementById("previewContainer");
	      		const list = document.getElementById("previewList");
	      		list.innerHTML = "";

	      		previewData = { importedKeys, existingKeys };

	      		for (const [id, { name, key }] of Object.entries(importedKeys)) {
	        		const exists = existingKeys[id];
	        		const isSame = exists && exists.key === key && exists.name === name;

			        const label = exists
			          	? isSame
			            	? "(уже есть)"
			            	: "(будет обновлено)"
			          	: "(новый)";

			        const row = document.createElement("div");
			        row.style.display = "flex";
			        row.style.alignItems = "left";
			        row.style.marginBottom = "6px";
			        row.style.gap = "8px";
					row.className = "form-check form-switch";

			        const checkbox = document.createElement("input");
			        checkbox.type = "checkbox";
					checkbox.className = "form-check-input";
					checkbox.role="switch"
			        checkbox.checked = true;
			        checkbox.dataset.id = id;

			        const text = document.createElement("div");
			        text.innerHTML = `<strong>${name}</strong> <small>(formId ${id})</small>:<br /> <code>${key.slice(0, 18)}</code> <span style="color:gray;">${label}</span>`;

			        row.appendChild(checkbox);
			        row.appendChild(text);
			        list.appendChild(row);
	      		}

	      		container.style.display = "block";
	    	});
	  	});
	}

	document.getElementById("confirmImportBtn").addEventListener("click", () => {
	  	if (!previewData) return;

	  	const { importedKeys, existingKeys } = previewData;
	  	const selected = {};

	  	document.querySelectorAll("#previewList input[type=checkbox]").forEach(cb => {
	    	if (cb.checked) {
	      		const id = cb.dataset.id;
	      		selected[id] = importedKeys[id];
	    	}
	  	});

	  	const merged = { ...existingKeys, ...selected };

	  	getStorageArea().then(storage => {
	    	storage.set({ apiKeys: merged }).then(() => {
	      		renderKeys(merged);
	      		document.getElementById("previewContainer").style.display = "none";
	      		previewData = null;
	      		showStatusMessage(translations[currentLang].importedKeysSaved, "info");
	    	});
	  	});
	});

	document.getElementById("selectAllBtn").addEventListener("click", () => {
	  	document.querySelectorAll("#previewList input[type=checkbox]").forEach(cb => cb.checked = true);
	});

	document.getElementById("deselectAllBtn").addEventListener("click", () => {
	  	document.querySelectorAll("#previewList input[type=checkbox]").forEach(cb => cb.checked = false);
	});

	document.getElementById("cancelImportBtn").addEventListener("click", () => {
	  	document.getElementById("previewContainer").style.display = "none";
	  	previewData = null;
	});
});
