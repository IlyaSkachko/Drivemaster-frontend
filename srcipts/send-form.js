class OrderForm {
    constructor(formSelector, endpoint) {
        this.form = document.querySelector(formSelector);
        this.endpoint = `https://localhost:7291/${endpoint}`;

        // Модальное окно
        this.modal = document.querySelector("#modal");
        this.modalMessage = document.querySelector("#modal-message");
        this.modalClose = document.querySelector("#modal-close");

        this.modalClose.addEventListener("click", () => this.hideModal());
        window.addEventListener("click", (e) => {
            if (e.target === this.modal) this.hideModal();
        });

        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.clearErrors();
            this.handleSubmit();
        });
    }

    showModal(message) {
        this.modalMessage.textContent = message;
        this.modal.style.display = "block";
    }

    hideModal() {
        this.modal.style.display = "none";
    }

    getFormData() {
        return {
            clientName: this.form.querySelector("#name").value.trim(),
            clientSurname: this.form.querySelector("#surname").value.trim(),
            clientEmail: this.form.querySelector("#email").value.trim(),
            clientPhone: this.form.querySelector("#phone").value.trim(),
            telegram: this.form.querySelector("#telegram").value.trim(),
            question: this.form.querySelector("#question").value.trim(),
        };
    }

    showError(inputId, message) {
        const field = this.form.querySelector(`#${inputId}`);
        if (field) {
            const errorDiv = field.closest("label").querySelector(".error-message");
            if (errorDiv) errorDiv.textContent = message;
            field.classList.add("input-error");
        }
    }

    clearErrors() {
        this.form.querySelectorAll(".error-message").forEach(el => el.textContent = "");
        this.form.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
    }

    async handleSubmit() {
        const data = this.getFormData();
        let valid = true;

        if (!data.clientName) { this.showError("name", "Введите имя"); valid = false; }
        if (!data.clientSurname) { this.showError("surname", "Введите фамилию"); valid = false; }
        if (!data.clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.clientEmail)) { this.showError("email", "Введите корректный email"); valid = false; }
        if (!data.clientPhone || !/^\+?[1-9]\d{1,14}$/.test(data.clientPhone)) { this.showError("phone", "Введите корректный номер телефона"); valid = false; }
        if (!this.form.querySelector("#privacy").checked) { this.showError("privacy", "Необходимо согласиться с политикой"); valid = false; }

        if (!valid) return;

        try {
            const response = await fetch(this.endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorResult = await response.json().catch(() => null);
                if (errorResult && Array.isArray(errorResult.errors)) {
                    errorResult.errors.forEach(err => this.showError(err.propertyName.toLowerCase(), err.errorMessage));
                } else {
                    this.showModal("Ошибка при отправке формы");
                }
                return;
            }

            this.form.reset();
            this.showModal("Заявка успешно отправлена!");
        } catch (error) {
            console.error(error);
            this.showModal("Не удалось отправить заявку. Попробуйте позже.");
        }
    }
}
