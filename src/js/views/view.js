// @ts-ignore
import icons from "url:../../img/icons.svg";

export default class View {
    _parentElement;
    _data;
    _errorMessage;
    _successMessage;

    /**
     * Render the recieved object to the DOM
     * @param {Object | Object[]} data The data to be rendered
     * @param {boolean} [render=true] If false, return markup string otherwise render to DOM
     * @returns {undefined | string} Returns a markup string if render=false
     * @this {Object} View object
     * @todo Finish implementation
     */
    render(data, render = true) {
        if (!data || (Array.isArray(data) && data.length === 0)) {
            return this.renderError();
        }
        this._data = data;

        const markup = this._generateMarkup();

        if (!render) return markup;

        this._clearParent();
        this._parentElement?.insertAdjacentHTML("afterbegin", markup);
    }

    update(data) {
        // this._updateData(data);
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM = document
            .createRange()
            // @ts-ignore
            .createContextualFragment(newMarkup);
        // New virtual DOM
        const newElements = Array.from(newDOM.querySelectorAll("*"));
        const curElements = Array.from(
            this._parentElement.querySelectorAll("*")
        );

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];

            if (!newEl.isEqualNode(curEl)) {
                // Update elements that contain text directly
                if (newEl.firstChild?.nodeValue?.trim() !== "")
                    curEl.textContent = newEl.textContent;

                // Update attributes for elements that have changed attributes
                Array.from(newEl.attributes).forEach(attr =>
                    curEl.setAttribute(attr.name, attr.value)
                );
            }
        });
    }

    _clearParent() {
        // @ts-ignore
        this._parentElement.innerHTML = "";
    }

    renderSpinner() {
        const markup = `
		<div class="spinner">
			<svg>
				<use href="${icons}#icon-loader"></use>
			</svg>
		</div>
		`;
        this._clearParent();
        this._parentElement?.insertAdjacentHTML("afterbegin", markup);
    }

    renderError(message = this._errorMessage) {
        const markup = `
		<div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
		`;
        this._clearParent();
        this._parentElement?.insertAdjacentHTML("afterbegin", markup);
        // console.log("Error", message, this._parentElement);
    }

    renderMessage(message = this._successMessage) {
        const markup = `
		<div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
        </div>
		`;
        this._clearParent();
        this._parentElement?.insertAdjacentHTML("afterbegin", markup);
    }

    addHandlerRender(handler) {
        ["hashchange", "load"].forEach(ev =>
            window.addEventListener(ev, handler)
        );
    }

    _generateMarkup() {}
}
