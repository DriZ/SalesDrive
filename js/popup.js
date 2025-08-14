const $langToggleBtn = $("#langToggleBtn");
const $themeToggleBtn = $("#themeToggleBtn");
let currentLang = "ua";
const isMac = navigator.platform.toUpperCase().includes('MAC');
const modifierKey = isMac ? '⌘' : 'Ctrl';
const delKey = isMac ? '⌫' : 'Del';
const returnKey = isMac ? "Return" : "Enter";


const $hiddenFileInput = $("<input>", {
	type: "file",
	accept: ".json",
})
	.css({
		display: 'none',
	})
	.append("body");

async function getStorageArea() {
	try {
		await chrome.storage.sync.get(null);
		return chrome.storage.sync;
	} catch {
		console.warn("sync недоступен, используем local");
		return chrome.storage.local;
	}
}

$themeToggleBtn.on("click", () => {
	const $body = $("body")
	$body.toggleClass("dark-theme");
	const isDark = $body.hasClass("dark-theme");
	getStorageArea().then(storage => storage.set({ theme: isDark ? "dark" : "light" }));
	$body.attr("data-bs-theme", $body.hasClass("dark-theme") ? "dark" : "light");
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
		editNamePlaceholder: "Введіть зрозуміле ім’я ключа",
		formIdPlaceholder: "Заповниться автоматично",
		previewText: "Перегляд ключів:",
		selectAllBtn: "Обрати всі",
		deselectAllBtn: "Зняти всі",
		confirmImportBtn: "Імпортувати обрані",
		cancelImportBtn: "Відмінити",
		themeToggleBtn: "🌙 Змінити тему",
		invalidKey: "Невірний ключ",
		errWhileExtractKey: "Помилка при видобутті formId",
		keySaved: "Ключ успішно збережено.",
		allKeysCleared: "Всі ключі успішно очищені.",
		selectJsonFile: "Виберіть JSON-файл для импорту.",
		errWhileReadJson: "Помилка при читанні JSON-файлу.",
		edit: "Редагувати",
		editKey: "Редагувати ключ",
		delete: "Видалити",
		deleteKey: "Видалити ключ",
		enterValidKey: "Введіть дійсний ключ (100 символів).",
		importedKeysSaved: "Обрані ключі успішно імпортовані.",
		exportKeysSuccess: "Ключі успішно експортовані",
		removeAllApiKeys: "Ви дійсно хочете видалити всі API ключі?",
		actionCantBeUndone: "Цю дію не можна скасувати.",
		fillAllFields: "Заповніть всі поля",
		file2Large: "Файл занадто великий. Максимум 2 MB",
		fileLoaded: "Файл завантажений. Перегляньте перед імпортом",
		incorrectStruct: "Неправильна структура apiKeys",
		exists: "Вже є",
		beUpdated: "Буде оновлено",
		new: "Новий",
		editNameText: "Назва ключа",
		cancel: "Скасувати",
		noneKeysYet: "Поки немає ключів...",
		addKey: "Додати API ключ",
		fillAuto: "Заповниться автоматично",
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
		editNamePlaceholder: "Введите понятное имя ключа",
		formIdPlaceholder: "Заполнится автоматически",
		previewText: "Предпросмотр ключей:",
		selectAllBtn: "Выбрать все",
		deselectAllBtn: "Снять все",
		confirmImportBtn: "Импортировать выбранные",
		cancelImportBtn: "Отмена",
		themeToggleBtn: "🌙 Сменить тему",
		invalidKey: "Неверный ключ",
		errWhileExtractKey: "Ошибка при извлечении formId",
		keySaved: "Ключ успешно сохранен.",
		allKeysCleared: "Все ключи успешно очищены.",
		selectJsonFile: "Выберите JSON-файл для импорта.",
		errWhileReadJson: "Ошибка при чтении JSON-файла.",
		edit: "Редактировать",
		editKey: "Редактировать ключ",
		delete: "Удалить",
		deleteKey: "Удалить ключ",
		enterValidKey: "Введите действительный ключ (100 символов).",
		importedKeysSaved: "Выбранные ключи успешно импортированы.",
		exportKeysSuccess: "Ключи успешно экспортированы",
		removeAllApiKeys: "Вы действительно хотите удалить все API ключи?",
		actionCantBeUndone: "Это действие нельзя отменить.",
		fillAllRows: "Заполните все поля",
		file2Large: "Файл слишком большой. Максимум 2 MB",
		fileLoaded: "Файл загружен. Проверьте предпросмотр перед импортом",
		incorrectStruct: "Неверная структура apiKeys",
		exists: "Уже есть",
		beUpdated: "Будет обновлено",
		new: "Новый",
		editNameText: "Имя ключа",
		cancel: "Отмена",
		noneKeysYet: "Пока нет ключей...",
		addKey: "Добавить API ключ",
		fillAuto: "Заполнится автоматически",
	}
};

function updateLanguage() {
	const t = translations[currentLang];

	for (let key in t) {
		// Обработка placeholder
		if (key.endsWith("Placeholder")) {
			const inputId = key.replace("Placeholder", "");
			const $inputEl = $(`#${inputId}`);
			if ($inputEl.length) $inputEl.attr("placeholder", t[key]);
			continue;
		}

		// Обработка обычного текста
		const $el = $(`#${key}`);
		if ($el.length) $el.text(t[key]);
	}

	// Обновляем toggleKeysBtn по классу
	const $toggleBtn = $("#toggleKeysBtn");
	if ($toggleBtn.length) {
		const isHidden = $toggleBtn.hasClass("hide");
		$toggleBtn.text(isHidden ? t.toggleKeysBtn : t.hideKeys);
	}
}

function getFormTemplate() {
	return $('#editFormTemplate form').clone();
}

$langToggleBtn.on("click", () => {
	currentLang = currentLang === "ua" ? "ru" : "ua";
	getStorageArea().then(storage => storage.set({ selectedLang: currentLang }))
	updateLanguage();
});

/**
 * Всплывающие уведомления
 * @param message // текст уведомления
 * @param type // тип уведомления success | info | error | danger
 * @param duration // время исчезновения
 */
function showStatusMessage(message, type = 'info', duration = 5000) {
	const icons = {
		success: '✅',
		error:   '❌',
		info:    'ℹ️',
		warning: '⚠️'
	};

	const toastId = `toast-${Date.now()}`;
	const $toast = $(`
        <div id="${toastId}" class="toast-item text-bg-${type}" style="
            min-width: 250px;
            margin-bottom: 10px;
            padding: 12px 16px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            user-select: none;
            position: relative;
        ">
            <span class="me-2">${icons[type] || icons.info}</span>${message}
            <button class="btn-close float-end" style="opacity: 0.8;"></button>
        </div>
    `);

	$('#toastContainer').append($toast);

	// Авто-удаление
	const timer = setTimeout(() => {
		$toast.fadeOut(300, () => $toast.remove());
	}, duration);

	// Закрытие вручную
	$toast.find('.btn-close').on('click', () => {
		clearTimeout(timer);
		$toast.fadeOut(200, () => $toast.remove());
	});
}

/**
 * Создание бейджа с хоткеями
 * @param keys
 * @returns {string}
 */
function createBadge(...keys) {
	return `<span class="badge bg-primary">${keys.join("+")}</span>`;
}

$(document).on('click', '#statusMessage', function () {
	const $box = $(this);
	const t = $box.data('hideTimer');
	if (t) clearTimeout(t);
	$box.stop(true, true).fadeOut(150);
});

/**
 * Проверка валидности апи ключа и извлечение formId
 * @param apiKey
 * @returns {Promise<string|null>}
 */
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

/**
 * Добавление нового апи ключа
 */
async function addKey() {
	showModal({
		title: translations[currentLang].addKey,
		bodyHTML: () => getFormTemplate(),
		okLabel: translations[currentLang].saveBtn,
		onConfirm: async () => {
			const $form = $('#confirmModal').find("form");
			const name = $form.find('#editName').val().trim();
			const key = $form.find('#editValue').val().trim();

			if (!name || !key) {
				showStatusMessage(translations[currentLang].fillAllFields, 'warning');
				return;
			}

			const formId = await extractFormInfo(key);
			if (!formId) {
				showStatusMessage(translations[currentLang].invalidKey, 'danger');
				return;
			}

			const storage = await getStorageArea();
			const { apiKeys = {} } = await storage.get({ apiKeys: {} });

			apiKeys[formId] = { name, key };

			await storage.set({ apiKeys });
			renderKeys(apiKeys);
			showStatusMessage(translations[currentLang].keySaved, 'success');
		}
	});

	// Вставка формы и автофокус
	setTimeout(() => {
		$('#confirmModal').one('shown.bs.modal', function () {
			injectFormIntoModal({
				values: {
					editName: '',
					editValue: ''
				},
				focusSelector: '#editValue',
				onReady: ($form) => validateForm($form)
			});
			$("#editValue").trigger("focus");
		});
	}, 50);
}

/**
 * Редактирование апи ключа
 * @param id
 */
async function editKey(id) {
	const storage = await getStorageArea();
	const { apiKeys = {} } = await storage.get({ apiKeys: {} });
	const current = apiKeys[id];

	showModal({
		title: `${translations[currentLang].editKey} «${current.name}»`,
		bodyHTML: () => getFormTemplate(),
		okLabel: translations[currentLang].saveBtn,
		onConfirm: async () => {
			const $form = $('#confirmModal').find("form");
			const name = $form.find('#editName').val().trim();
			const key = $form.find('#editValue').val().trim();

			if (!name || !key) return; // можно сделать alert или shake effect

			apiKeys[id] = { name, key };
			await storage.set({ apiKeys });
			renderKeys(apiKeys);
			showStatusMessage(translations[currentLang].keySaved, 'success');
		}
	});

	// Заполнить форму данными (после .show)
	setTimeout(() => {
		$('#confirmModal').one('shown.bs.modal', function () {
			injectFormIntoModal({
				values: {
					editName: current.name,
					editValue: current.key
				},
				focusSelector: '#editName',
				onReady: ($form) => validateForm($form)
			});
			$("#editValue").trigger("focus");
		});
	}, 50);
}

/**
 * Валидация полей в модалке
 * @param $form // селектор формы
 */
function validateForm($form) {
	const $apiKeyEl = $form.find('#editValue');
	const $keyNameEl = $form.find('#editName');

	let apiKeyTimer = null;
	$apiKeyEl.on("input", function () {
		clearTimeout(apiKeyTimer);
		const apiKey = $(this).val().trim();

		if (apiKey.length === 0) {
			$(this).removeClass("is-invalid is-valid");
			updateSaveButtonState("#confirmModal");
			if ($form.find("#formId").length) $form.find('#formId').val("");
			return;
		}

		if (apiKey.length !== 100) {
			$(this).removeClass("is-valid").addClass("is-invalid");
			updateSaveButtonState("#confirmModal");
			if ($form.find("#formId").length) $form.find('#formId').val("");
			return;
		}

		$("#apiKeyLoader").fadeIn(150);

		apiKeyTimer = setTimeout(async () => {
			const formId = await extractFormInfo(apiKey);
			$("#apiKeyLoader").fadeOut(150);

			if (formId) {
				if (!$form.find('#formId').length) {
					$form.append(`
						<div class="mb-2">
							<label for="formId" class="form-label">Form ID</label>
							<input type="text" class="form-control" id="formId" placeholder="${translations[currentLang].fillAuto}" readonly>
						</div>
					`);
				}
				$form.find('#formId').val(formId);
				$(this).removeClass("is-invalid").addClass("is-valid");
				$keyNameEl.trigger("focus");
			} else {
				$form.find('#formId').val('');
				$(this).removeClass("is-valid").addClass("is-invalid");
			}

			updateSaveButtonState('#confirmModal');
		}, 600);
	});

	$keyNameEl.on("input", function () {
		const keyName = $(this).val().trim();
		const isInvalid = keyName.length < 3;

		$(this)
			.toggleClass("is-invalid", isInvalid)
			.toggleClass("is-valid", !isInvalid);

		updateSaveButtonState("#confirmModal");
	});

	function updateSaveButtonState(containerSelector = 'body') {
		const $container = $(containerSelector);

		const $apiKeyEl = $container.find('#editValue');
		const $keyNameEl = $container.find('#editName');
		const $saveBtn = $container.find('#confirmModalOk');

		const apiKey = $apiKeyEl.val()?.trim() || '';
		const keyName = $keyNameEl.val()?.trim() || '';

		const isApiKeyValid = apiKey.length === 100;
		const isKeyNameValid = keyName.length >= 3;
		const isFormValid = isApiKeyValid && isKeyNameValid;

		$saveBtn.prop('disabled', !isFormValid);
		$saveBtn
			.toggleClass('btn-success', isFormValid)
			.toggleClass('btn-primary', !isFormValid)
			.html(isFormValid
				? `<i class="fas fa-check me-1"></i>${translations[currentLang].saveBtn}`
				: translations[currentLang].saveBtn);
	}
	$("#confirmModalOk").prop('disabled', true);
}

/**
 * Небольшой эскейп, чтобы безопасно подставлять названия в HTML
 * @param str
 * @returns {string}
 */
function escapeHtml(str = '') {
	return String(str)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

/**
 * Вставляем body в модалку
 * @param values // значения полей модалки
 * @param focusSelector // селектор, куда нужно поставить фокус
 * @param onReady // вызов функции после вставки
 */
function injectFormIntoModal({ values = {}, focusSelector, onReady }) {
	const $modalBody = $('#confirmModal .modal-body');
	const $form = $modalBody.find('form');

	if (!$form.length) {
		console.warn('Форма не найдена в модалке');
		return;
	}

	$form.removeClass('d-none');

	// Заполнение значений
	for (const [key, value] of Object.entries(values)) {
		$form.find(`#${key}`).val(value);
	}

	// Автофокус
	if (focusSelector) {
		$form.find(focusSelector).trigger('focus');
	}

	// Дополнительные действия
	if (typeof onReady === 'function') {
		onReady($form);
	}
}

/**
 * Универсальная модалка
 * options: { title, bodyHTML, okLabel, okClass, onConfirm, onCancel }
 */
function showModal({ title, bodyHTML, okLabel = 'ОК', okClass = 'btn-primary', onConfirm, onCancel }) {
	const $modalEl = $('#confirmModal');
	const modalEl = $modalEl[0];
	const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);

	const $modalBody = $modalEl.find('.modal-body');
	$modalBody.empty();

	// Темизация
	modalEl.setAttribute(
		'data-bs-theme',
		$('body').hasClass('dark-theme') ? 'dark' : 'light'
	);

	$modalEl.find('.modal-title').text(title);

	const $okBtn = $modalEl.find('#confirmModalOk');
	$okBtn.html(`${okLabel} ${createBadge(returnKey)}`).attr('class', `btn ${okClass}`);

	const $cancelBtn = $modalEl.find("#cancel");
	$cancelBtn.html(`${$cancelBtn.text()} ${createBadge("Esc")}`);

	const onOk = function () {
		cleanup();
		bsModal.hide();
		if (typeof onConfirm === 'function') onConfirm();
	};
	const onHide = function () {
		cleanup();
		if (typeof onCancel === 'function') onCancel();
	};
	const onKey = function (e) {
		if (e.key === 'Enter') {
			e.preventDefault();
			onOk();
		}
		if (e.key === 'Escape') {
			e.preventDefault();
			cleanup();
			bsModal.hide();
		}
	};
	const cleanup = function () {
		$okBtn.off('click', onOk);
		$modalEl.off('hidden.bs.modal', onHide);
		$modalEl.off('keydown', onKey);
	};

	$okBtn.one('click', onOk);
	$modalEl.one('hidden.bs.modal', onHide);
	$modalEl.on('keydown', onKey);

	$modalEl.one('shown.bs.modal', function () {
		if (typeof bodyHTML === 'function') {
			const content = bodyHTML();
			if (typeof content === 'string') {
				$modalBody.html(content);
			} else if (content instanceof jQuery || content instanceof HTMLElement) {
				$modalBody.append(content);
			}
		} else {
			$modalBody.html(bodyHTML);
		}
	});

	bsModal.show();
}

/**
 * Подтверждение действия
 * options: { title, message, okLabel, okVariant } // okVariant: 'danger' | 'primary' | ...
 */
function confirmModal({ title = 'Подтверждение', message, okLabel = 'Подтвердить', okVariant = 'primary' } = {}) {
	return new Promise((resolve) => {
		showModal({
			title,
			bodyHTML: `<p class="mb-0">${escapeHtml(message)}</p>`,
			okLabel,
			okClass: `btn-${okVariant}`,
			onConfirm: () => resolve(true),
			onCancel: () => resolve(false),
		});
	});
}

/**
 * Функция удаления ключа
 * @param id // id удаляемого ключа
 * @param label // Имя удаляемого ключа
 */
async function deleteKey(id, label) {
	const confirmed = await confirmModal({
		title: translations[currentLang].deleteKey,
		message: `${translations[currentLang].deleteKey} «${label || id}»? ${translations[currentLang].actionCantBeUndone}`,
		okLabel: translations[currentLang].delete,
		okVariant: 'danger'
	});
	if (!confirmed) return;

	const storage = await getStorageArea();
	const { apiKeys = {} } = await storage.get({ apiKeys: {} });
	if (!(id in apiKeys)) return; // уже удалён или не найден

	delete apiKeys[id];

	await storage.set({ apiKeys });
	renderKeys(apiKeys);
}

async function deleteAllKeys() {
	const confirmed = await confirmModal({
		title: translations[currentLang].clearAllBtn,
		message: translations[currentLang].removeAllApiKeys + " " + translations[currentLang].actionCantBeUndone,
		okLabel: translations[currentLang].delete,
		okVariant: 'danger'
	});
	if (!confirmed) return;

	const storage = await getStorageArea()
	await storage.set({ apiKeys: {} });
	renderKeys({});
	showStatusMessage(translations[currentLang].allKeysCleared, "success")
}

function renderKeys(apiKeys = null) {
	getStorageArea().then(storage => {
		const $list = $("#keysList");
		$list.empty();

		const showKeys = (data) => {
			const keys = apiKeys ?? data?.apiKeys ?? {};
			const ids = Object.keys(keys);

			const addKeyBtn = $("<button>")
				.addClass("btn btn-outline-secondary")
				.attr("id", "addBtn")
				.attr("title", translations[currentLang].addKey ?? "Add API Key")
				.html(`<i class="fa fa-plus"></i> ${translations[currentLang].addKey} ${createBadge(modifierKey, "N")}`)
				.on("click", () => addKey());
			$list.append(addKeyBtn);

			if (ids.length === 0) {
				$list.append($("<div>").text(translations[currentLang].noneKeysYet));
				return;
			}

			$.each(keys, (id, { name = "Без имени", key = "" }) => {
				const $item = $("<div>")
					.addClass("key-item d-flex align-items-center justify-content-between")
					.css("gap", "12px");

				const $infoBlock = $("<div>").append(
					$("<strong>").text(name),
					$("<small>").text(` (formId ${id})`),
					$("<br>"),
					$("<span>").append($("<code>").text(key.slice(0, 18) + "***"))
				);

				const $actionsBlock = $("<div>")
					.addClass("d-flex")
					.css("gap", "6px");

				const index = Object.keys(keys).indexOf(id); // 0-based
				const $editBtn = $("<button>")
					.addClass("btn btn-outline-secondary editBtn")
					.attr("title", translations?.[currentLang]?.edit + ` (${modifierKey}+${index + 1})` ?? "Edit")
					.html(`<i class="fa fa-pen"></i>`)
					.on("click", () => editKey(id));

				const $deleteBtn = $("<button>")
					.addClass("btn btn-outline-danger deleteBtn")
					.attr("title", translations?.[currentLang]?.delete ?? "Delete")
					.html('<i class="fa fa-trash"></i>')
					.on("click", () => deleteKey(id, name));

				$actionsBlock.append($editBtn, $deleteBtn);
				$item.append($infoBlock, $actionsBlock);
				$list.append($item);
			});

			const $deleteAllBtn = $("<button>")
				.addClass("btn btn-danger")
				.attr("id", "deleteAllBtn")
				.attr("title", translations?.[currentLang]?.clearAllBtn ?? "Delete all keys")
				.html(`<i class="fa fa-trash-can"></i> ${translations[currentLang]?.clearAllBtn} ${createBadge(modifierKey, delKey)}`)
				.on("click", () => deleteAllKeys());
			$list.append($deleteAllBtn);
		};

		if (apiKeys) showKeys({ apiKeys });
		else storage.get({ apiKeys: {} }).then(showKeys);
	});
}

$(() => {
	getStorageArea().then(storage => {
		storage.get(["selectedLang", "theme"], (result) => {
			currentLang = result.selectedLang || (navigator.language.startsWith("uk") ? "ua" : "ru");
			if (result.theme === "dark") $("body").addClass("dark-theme");
			updateLanguage();
		});
	});

	$langToggleBtn.on("click", () => {
		$(".editBtn").attr("title", translations[currentLang].edit);
		$(".deleteBtn").attr("title", translations[currentLang].delete);
	});

	$("#exportBtn").on("click", () => {
		getStorageArea().then(storage => {
			storage.get({ apiKeys: {} }).then(({ apiKeys }) => {
				const blob = new Blob([JSON.stringify(apiKeys, null, 2)], { type: "application/json" });
				const url = URL.createObjectURL(blob);
				$("<a>", {
					href: url,
					download: "apiKeys.json"
				})[0].click();
				URL.revokeObjectURL(url);
				showStatusMessage(translations[currentLang].exportKeysSuccess, "success")
			});
		});
	});

	$("#importBtn").on("click", () => {
		$hiddenFileInput.trigger("click");
	});

	function isValidApiKeys(obj) {
		if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return false;
		return Object.keys(obj).every((k) => {
			const v = obj[k];
			return typeof v === 'string' || (v && typeof v === 'object' && typeof v.key === 'string');
		});
	}

	$hiddenFileInput.on('change', (event) => {
		const file = event.target?.files[0];
		if (!file) return;

		const isJsonByName = /\.json$/i.test(file.name);
		const isJsonByType = file.type === 'application/json' || file.type === '';
		const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

		if (!isJsonByName && !isJsonByType) {
			showStatusMessage(translations[currentLang].selectJsonFile, 'error');
			this.value = '';
			return;
		}
		if (file.size > MAX_SIZE) {
			showStatusMessage(translations[currentLang].file2Large, 'error');
			this.value = '';
			return;
		}

		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				const parsed = JSON.parse(ev.target.result);

				if (!isValidApiKeys(parsed)) throw new Error(translations[currentLang].incorrectStruct);

				showPreview(parsed); // твоя функция предпросмотра
				showStatusMessage(translations[currentLang].fileLoaded, 'info');
			} catch (err) {
				console.error('Ошибка при парсинге JSON:', err);
				showStatusMessage(translations[currentLang].errWhileReadJson, 'error');
			} finally {
				$hiddenFileInput.val('');
			}
		};
		reader.readAsText(file);
	});

	renderKeys();

	let previewData = null;

	function showPreview(importedKeys) {
		getStorageArea().then(storage => {
			storage.get({ apiKeys: {} }).then(({ apiKeys: existingKeys }) => {
				const $container = $("#previewContainer");
				const $list = $("#previewList");
				$list.empty();

				previewData = { importedKeys, existingKeys };

				for (const [id, { name, key }] of Object.entries(importedKeys)) {
					const exists = existingKeys[id];
					const isSame = exists && exists.key === key && exists.name === name;

					const label = exists
						? isSame
							? translations[currentLang].exists
							: translations[currentLang].beUpdated
						: translations[currentLang].new;

					const $row = $("<div>", {
						class: "form-check form-switch",
						css: {
							display: "flex",
							alignItems: "left",
							marginBottom: "6px",
							gap: "8px"
						}
					});

					const $checkbox = $("<input>", {
						class: "form-check-input",
						type: "checkbox",
						role: "switch",
						checked: true,
					}).attr("data-id", id);

					const $text = $("<div>").html(`<strong>${name}</strong> <small>(formId ${id})</small>:<br /> <code>${key.slice(0, 18)}</code> <span style="color:gray;">${label}</span>`);
					$row.append($checkbox).append($text);
					$list.append($row);
				}

				$container.show()
			});
		});
	}

	$("#confirmImportBtn").on("click", () => {
		if (!previewData) return;

		const { importedKeys, existingKeys } = previewData;
		const selected = {};

		$("#previewList input[type=checkbox]:checked").each(function () {
			const id = $(this).attr("data-id");
			selected[id] = importedKeys[id];
		});

		const merged = $.extend({}, existingKeys, selected);
		const $btn = $(this).prop("disabled", true);

		getStorageArea().then(storage => {
			storage.set({ apiKeys: merged }).then(() => {
				renderKeys(merged);
				$("#previewContainer").hide();
				previewData = null;
				showStatusMessage(translations[currentLang].importedKeysSaved, "success");
			}).finally(() => {
				$btn.prop("disabled", false);
			});
		});
	});

	$(document).on("click", "#selectAllBtn", () => {
		$("#previewList input[type=checkbox]").prop("checked", true)
	});

	$(document).on("click", "#deselectAllBtn", () => {
		$("#previewList input[type=checkbox]").prop("checked", false)
	});

	$(document).on("click", "#cancelImportBtn", () => {
		$("#previewContainer").hide();
		previewData = null;
	});

	$(document).on('keydown', function(e) {
		const tag = e.target.tagName.toLowerCase();
		if (tag === 'input' || tag === 'textarea') return;

		const cmd = isMac ? e.metaKey : e.ctrlKey;

		if (cmd && e.key === 'Backspace') {
			e.preventDefault();
			$('#deleteAllBtn').trigger('click');
		}

		if (cmd && (e.key === 'n' || e.key === 'N')) {
			e.preventDefault();
			$('#addBtn').trigger('click');
		}

		const num = parseInt(e.key);
		if (!isNaN(num) && num >= 1 && num <= 9) {
			e.preventDefault();
			$(".editBtn").eq(num - 1).trigger("click");
		}
	});

})
