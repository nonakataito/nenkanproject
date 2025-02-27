document.addEventListener("DOMContentLoaded", function () {
    const calendarGrid = document.getElementById("calendarGrid");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const memoModal = document.getElementById("memoModal");
    const memoText = document.getElementById("memoText");
    const saveMemo = document.getElementById("saveMemo");
    const closeModal = document.getElementById("closeModal");
    const selectedDateDisplay = document.getElementById("selectedDate");
    const monthName = document.getElementById("monthName");

    let selectedDate = "";
    let currentDate = new Date(); 
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();

    function updateCalendar(year, month) {
        calendarGrid.innerHTML = "";
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        monthName.textContent = `${year}年${month + 1}月`;

        // 空白セル（前月分）
        for (let i = 0; i < firstDay; i++) {
            let emptyCell = document.createElement("div");
            emptyCell.classList.add("day-cell", "empty");
            calendarGrid.appendChild(emptyCell);
        }

        // 日付のセル
        for (let i = 1; i <= daysInMonth; i++) {
            let dayCell = document.createElement("div");
            dayCell.classList.add("day-cell");
            dayCell.textContent = i;

            let formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
            dayCell.dataset.date = formattedDate;

            // 曜日を取得して土日なら色変更
            let dayOfWeek = new Date(year, month, i).getDay();
            if (dayOfWeek === 0) {
                dayCell.classList.add("sunday"); // 日曜日
            } else if (dayOfWeek === 6) {
                dayCell.classList.add("saturday"); // 土曜日
            }

            dayCell.addEventListener("click", function () {
                selectedDate = this.dataset.date;
                selectedDateDisplay.textContent = `メモ - ${selectedDate}`;
                memoText.value = "";
                memoModal.style.display = "flex";
            });

            calendarGrid.appendChild(dayCell);
        }

        loadMemos();
    }

    async function loadMemos() {
        const response = await fetch("/get_memos/");
        const data = await response.json();
        const memos = data.memos;

        document.querySelectorAll(".day-cell").forEach(dayCell => {
            const date = dayCell.dataset.date;
            if (memos[date]) {
                let memoIndicator = document.createElement("div");
                memoIndicator.classList.add("memo-indicator");
                memoIndicator.textContent = `${memos[date].length}件のメモあり`;
                dayCell.appendChild(memoIndicator);
            }
        });
    }

    saveMemo.addEventListener("click", async function () {
        if (!selectedDate) return;
        await fetch("/save_memo/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: selectedDate, text: memoText.value }),
        });

        memoModal.style.display = "none";
        updateCalendar(currentYear, currentMonth);
    });

    closeModal.addEventListener("click", function () {
        memoModal.style.display = "none";
    });

    prevMonthBtn.addEventListener("click", function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar(currentYear, currentMonth);
    });

    nextMonthBtn.addEventListener("click", function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar(currentYear, currentMonth);
    });

    updateCalendar(currentYear, currentMonth);
});
