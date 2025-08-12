const $langToggleBtn = $("#langToggleBtn");
const $themeToggleBtn = $("#themeToggleBtn");
let currentLang = "ua";

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
		editKey: "Редагувати ключ",
		delete: "Видалити",
		deleteKey: "Видалити ключ",
		enterValidKey: "Введіть дійсний ключ (100 символів).",
		importedKeysSaved: "Обрані ключі успішно імпортовані.",
		exportKeysSuccess: "Ключі успішно експортовані",
		removeAllApiKeys: "Ви дійсно хочете видалити всі API ключі?",
		actionCantBeUndone: "Цю дію не можна скасувати.",
		fillAllRows: "Заповніть всі поля",
		file2Large: "Файл занадто великий. Максимум 2 MB",
		fileLoaded: "Файл завантажений. Перегляньте перед імпортом",
		incorrectStruct: "Неправильна структура apiKeys",
		exists: "Вже є",
		beUpdated: "Буде оновлено",
		new: "Новий",
		editNameText: "Назва ключа",
		cancel: "Відміна",
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

$langToggleBtn.on("click", () => {
	currentLang = currentLang === "ua" ? "ru" : "ua";
	getStorageArea().then(storage => storage.set({ selectedLang: currentLang }))
	updateLanguage();
});

function showStatusMessage(message, type = 'info', duration = 5000) {
	const $box  = $('#statusMessage');
	const $icon = $('#statusIcon');
	const $text = $('#statusText');

	const icons = {
		success: '✅',
		error:   '❌',
		info:    'ℹ️',
		warning: '⚠️'
	};

	// Текст и иконка
	$text.text(message);
	$icon.text(icons[type] || icons.info);

	// Цветовая схема через классы
	$box
		.removeClass('status--success status--error status--info status--warning')
		.addClass(`status--${type}`);

	// Остановить прошлые анимации и таймер
	$box.stop(true, true).fadeIn(150);
	const prevTimer = $box.data('hideTimer');
	if (prevTimer) clearTimeout(prevTimer);

	// Авто-скрытие
	const hideTimer = setTimeout(() => {
		$box.fadeOut(300);
	}, duration);

	$box.data('hideTimer', hideTimer);
}

// По желанию: клик по сообщению — сразу скрыть
$(document).on('click', '#statusMessage', function () {
	const $box = $(this);
	const t = $box.data('hideTimer');
	if (t) clearTimeout(t);
	$box.stop(true, true).fadeOut(150);
});

async function editKey(id) {
	const storage = await getStorageArea();
	const { apiKeys = {} } = await storage.get({ apiKeys: {} });
	const current = apiKeys[id];

	showModal({
		title: `${translations[currentLang].editKey} «${current.name}»`,
		bodyHTML: $('#editForm').prop("outerHTML"),
		okLabel: translations[currentLang].saveBtn,
		onConfirm: async () => {
			const $form = $('#editForm');
			const name = $form.find('#editName').val().trim();
			const key = $form.find('#editValue').val().trim();

			if (!name || !key) return; // можно сделать alert или shake effect

			apiKeys[id] = { name, key };
			await storage.set({ apiKeys });
			renderKeys(apiKeys);
		}
	});

	// Заполнить форму данными (после .show)
	setTimeout(() => {
		const $form = $('#editForm');
		if ($form.length) {
			$form.removeClass('d-none');
			$form.find('#editName').val(current.name);
			$form.find('#editValue').val(current.key);
		}
	}, 50);
}

// Небольшой эскейп, чтобы безопасно подставлять названия в HTML
function escapeHtml(str = '') {
	return String(str)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

/**
 * Универсальная модалка
 * options: { title, bodyHTML, okLabel, okClass, onConfirm, onCancel }
 */
function showModal({ title, bodyHTML, okLabel = 'ОК', okClass = 'btn-primary', onConfirm, onCancel }) {
	const $modalEl = $('#confirmModal');
	const modalEl = $modalEl[0];
	const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);

	// Темизация
	modalEl.setAttribute(
		'data-bs-theme',
		$('body').hasClass('dark-theme') ? 'dark' : 'light'
	);

	$modalEl.find('.modal-title').text(title);
	$modalEl.find('.modal-body').html(bodyHTML);

	const $okBtn = $modalEl.find('#confirmModalOk');
	$okBtn.text(okLabel).attr('class', `btn ${okClass}`);

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


function renderKeys(apiKeys = null) {
	getStorageArea().then(storage => {
		const $list = $("#keysList");
		$list.empty();

		const showKeys = (data) => {
			const keys = apiKeys ?? data?.apiKeys ?? {};
			const ids = Object.keys(keys);

			if (ids.length === 0) {
				$list.append($("<div>").addClass("text-muted").text("Пока нет ключей"));
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

				const $editBtn = $("<button>")
					.addClass("btn btn-outline-secondary editBtn")
					.attr("title", translations?.[currentLang]?.edit ?? "Edit")
					.html('<i class="fa fa-pen"></i>')
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
		};

		if (apiKeys) {
			showKeys({ apiKeys });
		} else {
			storage.get({ apiKeys: {} }).then(showKeys);
		}
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

	const $formIdEl = $("#formId");
	const $apiKeyEl = $("#apiKey");
	const $keyNameEl = $("#keyName");

	let apiKeyTimer = null;

	$apiKeyEl.on("input", function () {
		clearTimeout(apiKeyTimer);
		const apiKey = $(this).val().trim();

		if (apiKey.length === 0) $(this).removeClass("is-invalid");
		else if ((apiKey.length > 0 && apiKey.length < 100) || apiKey.length > 100) $(this).addClass("is-invalid");
		else if (apiKey.length === 100) {
			apiKeyTimer = setTimeout(async function () {
				const formId = await extractFormInfo(apiKey);
				if (formId) {
					$formIdEl.val(formId);
					$(this).removeClass("is-invalid").addClass("is-valid");
					updateSaveButtonState();
					$keyNameEl.trigger("focus");
				} else {
					$formIdEl.val("");
					updateSaveButtonState();
				}
			}, 600); // задержка 600 мс после ввода
		}
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
		const formIdFilled = $formIdEl.val().trim() !== "";
		const keyNameFilled = ($keyNameEl.val().trim() !== "" && $keyNameEl.val().trim().length > 2);
		$saveBtn.prop("disabled", !(formIdFilled && keyNameFilled));
	}

	$keyNameEl.on("input", function () {
		const keyName = $(this).val().trim();
		const isInvalid = keyName.length < 3;

		$(this)
			.toggleClass("is-invalid", isInvalid)
			.toggleClass("is-valid", !isInvalid);

		updateSaveButtonState();
	});

	const $keysList = $("#keysList");

	const $toggleKeysBtn = $("#toggleKeysBtn");
	$toggleKeysBtn.on("click", function () {
		const isVisible = $keysList.css("maxHeight") !== "0px";

		if (isVisible) {
			$keysList.css({
				maxHeight: "0px",
				opacity: "0"
			});
			$toggleKeysBtn.text("Показать сохранённые ключи ⬇");
			$toggleKeysBtn.removeClass("show").addClass("hide");
		} else {
			$keysList.css({
				maxHeight: $keysList.prop("scrollHeight") + "px",
				opacity: "1"
			});
			console.log($keysList.prop('scrollHeight')); // > 0?
			$toggleKeysBtn.text("Скрыть сохранённые ключи ⬆");
			$toggleKeysBtn.removeClass("hide").addClass("show");
		}

		const isHidden = $toggleKeysBtn.hasClass("hide");
		$toggleKeysBtn.toggleClass("hide show");
		$toggleKeysBtn.text(!isHidden ? translations[currentLang].hideKeys : translations[currentLang].toggleKeysBtn);

		// $keysList.toggleClass("open");
	});

	$langToggleBtn.on("click", () => {
		$(".editBtn").attr("title", translations[currentLang].edit);
		$(".deleteBtn").attr("title", translations[currentLang].delete);
	});

	$keyNameEl.on("keydown", (e) => {
		if (e.key === "Enter" && !$saveBtn.prop("disabled")) {
			e.preventDefault(); // предотвращаем отправку формы
			$saveBtn.trigger("click");    // имитируем нажатие кнопки
		}
	});

	const $saveBtn = $("#saveBtn");
	$saveBtn.on("click", function () {
		const formId = $formIdEl.val().trim();
		const apiKey = $apiKeyEl.val().trim();
		const keyName = $keyNameEl.val().trim();

		if (!formId || !apiKey || !keyName) {
			showStatusMessage(translations[currentLang].fillAllRows, "warning");
			return
		}

		getStorageArea().then(storage => {
			storage.get({ apiKeys: {} }).then(({ apiKeys }) => {
				apiKeys[formId] = { name: keyName, key: apiKey };
				storage.set({ apiKeys }).then(() => {
					$("#apiKey, #keyName").val("");
					$('#formId')
						.prop('readonly', false)
						.val('')
						.addClass('cleared') // Добавим эффект, если хочешь
						.prop('readonly', true);
					renderKeys(apiKeys);
				})
			});
		});

		showStatusMessage(translations[currentLang].succKeySaved, "success")
		$apiKeyEl.trigger("focus");
	});

	$("#clearAllBtn").on("click", () => {
		if (!confirm(translations[currentLang].removeAllApiKeys)) return;
		getStorageArea().then(storage => storage.set({ apiKeys: {} }).then(() => renderKeys({})));
		showStatusMessage(translations[currentLang].allKeysCleared, "success")
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
})
