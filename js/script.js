(function () {
    'use strict';

    const formId = new URLSearchParams(window.location.search).get("formId") || "1";

    async function getStorageArea() {
        try {
            await chrome.storage.sync.get(null);
            return chrome.storage.sync;
        } catch {
            console.warn("sync недоступен, используем local");
            return chrome.storage.local;
        }
    }

    let apiKey = null;
    getStorageArea().then(storage => {
        storage.get({apiKeys: {}}).then(data => {
            const apiKeys = data.apiKeys;
            apiKey = apiKeys[formId]?.key;
        });
    });

    const style = document.createElement("style");
    style.textContent = `
        .fade-in-panel {
            opacity: 0;
            transition: opacity 0.6s ease;
        }
        .fade-in-panel.show {
            opacity: 1;
        }
        #layout-main-menu-top {
            position: sticky;
            top: 0;
            z-index: 20;
        }
        table.table-order thead tr {
            position: sticky;
            top: 38px;
            z-index: 10;
        }
        .table-wrapper-scroll {
            max-height: 600px;
            overflow-y: auto;
        }
        .btn-outline-primary:hover {
            background-color: #cbd2db;
            border-color: #c5cdd7;
            color: #3d414a;
        }
    `;
    document.head.appendChild(style);

    const statusMapping = {
        "1": {paid: 5, returned: 7},
        "2": {paid: 14, returned: 16},
        "3": {paid: 23, returned: 25}
    };

    const filters = [
        {
            label: "Продаж: поточний місяць",
            key: "current_paid",
            statusKey: "paid",
            dateField: "paymentDate",
            offset: 0,
            time: false
        },
        {
            label: "Продаж: попередній місяць",
            key: "prev_paid",
            statusKey: "paid",
            dateField: "paymentDate",
            offset: -1,
            time: false
        },
        {
            label: "Повернення: поточний місяць",
            key: "current_return",
            statusKey: "returned",
            dateField: "updateAt",
            offset: 0,
            time: true
        },
        {
            label: "Повернення: попередній місяць",
            key: "prev_return",
            statusKey: "returned",
            dateField: "updateAt",
            offset: -1,
            time: true
        },
        {
            label: "З боргом > 1 грн",
            key: "debt",
            statusKey: "paid",
            dateField: "restPay",
            offset: null,
            time: false,
            extra: "&filter%5BrestPay%5D%5Bfrom%5D=1",
            custom: true
        }
    ];

    function getMonthRange(offset = 0, includeTime = false) {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth() + 1 + offset;

        if (month < 1) {
            year -= 1;
            month = 12;
        } else if (month > 12) {
            year += 1;
            month = 1;
        }

        let pad = (n) => n.toString().padStart(2, "0");
        let from = `${year}-${pad(month)}-01`;
        let to = `${year}-${pad(month)}-${new Date(year, month, 0).getDate()}`;

        if (includeTime) {
            from += " 00:00:00";
            to += " 23:59:59";
        }

        return {from, to};
    }

    function setCookie(name, value, minutes = 15) {
        const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
    }

    function getCookie(name) {
        const cookie = document.cookie.split("; ").find(row => row.startsWith(name + "="));
        return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
    }

    async function fetchOrderTotalsCached(filterKey, query) {
        const countKey = `orderCount_${apiKey}_${filterKey}`;
        const amountKey = `orderAmount_${apiKey}_${filterKey}`;

        const cachedCount = getCookie(countKey);
        const cachedAmount = getCookie(amountKey);

        if (cachedCount !== null && cachedAmount !== null) {
            return {count: cachedCount, paymentAmount: cachedAmount};
        }

        const url = `https://kompikok.salesdrive.me/api/order/list/?limit=1${query}`;
        try {
            const res = await fetch(url, {
                headers: {"Form-Api-Key": apiKey}
            });
            const json = await res.json();
            const count = json?.totals?.count ?? "-";
            const amount = json?.totals?.paymentAmount ?? "-";
            setCookie(countKey, count, 15);
            setCookie(amountKey, amount, 15);
            return {count, paymentAmount: amount};
        } catch (e) {
            console.error("Ошибка API:", e);
            return {count: "-", paymentAmount: "-"};
        }
    }

    // Создаем панель для кнопок фильтров
    async function insertPanel(anchorBlock) {
        if (!apiKey) return
        const panel = document.createElement("div");
        panel.className = "btn-group btn-group-sm m-top10 d-flex flex-wrap fade-in-panel";
        panel.setAttribute("role", "group");

        filters.forEach(filter => {
            const button = document.createElement("button");
            button.className = "btn btn-outline-primary me-2 mb-2 d-flex align-items-center justify-content-between";
            button.style.pointerEvents = "auto";

            let url = `https://kompikok.salesdrive.me/ua/index.html?formId=${formId}#/order/index`;
            let query = "";
            const statusId = filter.statusKey
                ? statusMapping[formId]?.[filter.statusKey] || filter.statusId
                : filter.statusId;

            if (!filter.custom) {
                const {from, to} = getMonthRange(filter.offset, filter.time);
                query += `&filter[statusId]=${statusId}`;
                query += `&filter[${filter.dateField}][from]=${encodeURIComponent(from)}`;
                query += `&filter[${filter.dateField}][to]=${encodeURIComponent(to)}`;
                url += "?" + query.slice(1);
            } else {
                query += `&filter[statusId]=${statusId}${filter.extra}`;
                url += "?" + query.slice(1);
            }

            const currentHref = decodeURIComponent(window.location.href);
            const savedKey = getCookie("activeFilter");

            if (savedKey === filter.key || currentHref.includes(decodeURIComponent(url))) {
                button.classList.remove("btn-outline-primary");
                button.classList.add("btn-primary");
            }

            button.addEventListener("click", () => {
                panel.querySelectorAll("button").forEach(btn => {
                    btn.classList.remove("btn-primary");
                    btn.classList.add("btn-outline-primary");
                });
                button.classList.remove("btn-outline-primary");
                button.classList.add("btn-primary");
                setCookie("activeFilter", filter.key, 15);
                window.location.assign(url);
            });

            const resetBtn = document.querySelector("#wrap > div.container-fluid.order-index.ng-scope > div > div > div > div > div > div:nth-child(3) > div:nth-child(1) > button.btn.btn-default.m-right5.ng-binding.ng-scope");
            if (resetBtn) {
                resetBtn.addEventListener("click", () => {
                    panel.querySelectorAll("button").forEach(btn => {
                        btn.classList.remove("btn-primary");
                        btn.classList.add("btn-outline-primary");
                    });
                    setCookie("activeFilter", "", -1); // удаление cookie
                });
            }

            // Внутренний контейнер для текста и бейджей
            const content = document.createElement("div");
            content.className = "d-flex flex-column flex-grow-1 text-start";
            content.style.pointerEvents = "none";

            const label = document.createElement("span");
            label.textContent = filter.label;
            label.style.fontWeight = "500";

            const badgeRow = document.createElement("div");
            badgeRow.className = "d-flex gap-2 mt-1";

            const badgeCount = document.createElement("span");
            badgeCount.className = "badge badge-info rounded-pill bg-primary";
            badgeCount.textContent = "…";

            badgeRow.appendChild(badgeCount);
            content.appendChild(label);
            content.appendChild(badgeRow);
            button.appendChild(content);

            fetchOrderTotalsCached(filter.key, query).then(totals => {
                badgeCount.textContent = totals.count > 0 ? totals?.count + " шт: " + totals?.paymentAmount + " грн." : "—";
                if (totals?.count === 0) badgeCount.classList.replace("badge-info", "badge-secondary");
                else if (badgeCount.classList.contains("badge-secondary")) badgeCount.classList.replace("badge-secondary", "badge-info");
            });

            panel.appendChild(button);
        });

        anchorBlock.parentNode.insertBefore(panel, anchorBlock);
        requestAnimationFrame(() => {
            panel.classList.add("show");
        });

        const updateBtn = document.querySelector("#wrap > div.container-fluid.order-index.ng-scope > div > div > div > div > div > div.m-bot10.m-top5 > a.btn.btn-primary-alt.m-top5.m-right5.ng-binding");
        if (updateBtn) {
            updateBtn.addEventListener("click", () => {
                const panel = document.querySelector("#wrap > div.container-fluid.order-index.ng-scope > div > div > div > div > div > div:nth-child(3) > div.btn-group.btn-group-sm.m-top10.d-flex.flex-wrap.fade-in-panel.show");
                if (!panel) return;

                const buttons = panel.querySelectorAll("button");
                for (const button of buttons) {
                    const badge = button.querySelector(".badge");
                    const label = button.querySelector("span");
                    const filter = filters.find(f => f.label === label?.textContent?.trim());
                    if (!filter) continue;

                    const countKey = `orderCount_${apiKey}_${filter.key}`;
                    const amountKey = `orderAmount_${apiKey}_${filter.key}`;

                    const cachedCount = getCookie(countKey);
                    const cachedAmount = getCookie(amountKey);

                    if (cachedCount === null || cachedAmount === null) {
                        let query = "";
                        const statusId = filter.statusKey
                            ? statusMapping[formId]?.[filter.statusKey] || filter["statusId"]
                            : filter["statusId"];

                        if (!filter.custom) {
                            const {from, to} = getMonthRange(filter.offset, filter.time);
                            query += `&filter[statusId]=${statusId}`;
                            query += `&filter[${filter.dateField}][from]=${encodeURIComponent(from)}`;
                            query += `&filter[${filter.dateField}][to]=${encodeURIComponent(to)}`;
                        } else {
                            query += `&filter[statusId]=${statusId}${filter.extra}`;
                        }

                        fetchOrderTotalsCached(filter.key, query).then(totals => {
                            badge.textContent = totals.count + " шт: " + totals.paymentAmount + " грн.";
                            if (totals?.count === 0) badge.classList.replace("badge-info", "badge-secondary");
                            else if (badge.classList.contains("badge-secondary")) badge.classList.replace("badge-secondary", "badge-info");
                        });
                    }
                }
            });
        }
    }

    // Запускаем наблюдение
    const observer = new MutationObserver(() => {
        const anchor = document.querySelector("#wrap > div.container-fluid.order-index.ng-scope > div > div > div > div > div > div:nth-child(3) > div.m-top10.ng-scope");
        if (anchor && !document.querySelector(".btn-group-sm.m-top10")) {
            if (!document.querySelector(".btn-group-sm.m-top10")) insertPanel(anchor);
            //obs.disconnect(); // Останавливаем наблюдение после вставки
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
