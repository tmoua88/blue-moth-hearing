if (!customElements.get('comparison-wrapper')) {
  customElements.define(
    'comparison-wrapper',
    class ComparisonWrapper extends HTMLElement {
      constructor() {
        super();

        this.loading = false

        this.modalTriggers.forEach(trigger => {
          trigger.addEventListener('click', this.openModal.bind(this))
        })

        this.productExcludeTriggers.forEach(trigger => {
          trigger.addEventListener('click', this.excludeProduct.bind(this))
        })

        this.updateStatus()
        this.setBackStatus()
      }

      async excludeProduct(event) {
        this.loading = true
        this.updateStatus()

        const selectedHandle = event.currentTarget?.getAttribute('data-product-handle')
        const productHandleArray = []
        this.productExcludeTriggers.forEach(trigger => {
          const productHandle = trigger.getAttribute('data-product-handle')
          if (productHandle && productHandle !== selectedHandle) {
            productHandleArray.push(productHandle)
          }
        })
        this.removeFromCookie(selectedHandle)
        const nextUrl = new URL(location.href)
        if (productHandleArray.length > 0) {
          nextUrl.searchParams.set('type', productHandleArray.join(','))
        } else {
          nextUrl.searchParams.delete('type')
        }
        await this.updateContent(nextUrl)
      }

      async updateContent (url) {
        const sectionId = this.getAttribute('id')
        fetch(url)
          .then((response) => response.text())
          .then((responseText) => {
            const html = responseText;
            window.history.replaceState({}, '', url);
            const wrapperHtml = new DOMParser().parseFromString(html, 'text/html').getElementById(sectionId).outerHTML;
            this.outerHTML = wrapperHtml
            this.loading = false
            this.updateStatus()
          })
          .catch((e) => {
            console.error(e);
            this.loading = false
            this.updateStatus()
          });
      }

      removeFromCookie(handle) {
        const savedCompares = getCookie('COMPARE_PRODUCT_HANDLES') || '[]'
        const savedData = getCookie('COMPARE_PRODUCT_DATA') || '{}'
        const savedComparisonData = JSON.parse(savedData)

        const savedComparisonHandles = JSON.parse(savedCompares)
        const index = savedComparisonHandles.indexOf(handle)
        if (index > -1) savedComparisonHandles.splice(index, 1)
        if (savedComparisonData[handle]) delete savedComparisonData[handle]

        setCookie('COMPARE_PRODUCT_HANDLES', JSON.stringify(savedComparisonHandles));
        setCookie('COMPARE_PRODUCT_DATA', JSON.stringify(savedComparisonData));
        document.body.dispatchEvent(new CustomEvent('UPDATED_COMPARISON_PRODUCTS'));
      }

      openModal(event) {
        const { handle, value } = event.currentTarget?.dataset
        this.modals.forEach(modal => {
          const { modalHandle, modalValue } = modal.dataset
          if (handle == modalHandle && value == modalValue) {
            modal.open()
          } else {
            modal.close()
          }
        });
      }

      updateStatus() {
        if (this.loading) {
          this.classList.add('loading')
        } else {
          this.classList.remove('loading')
        }

        this.checkVisibility()
      }

      checkVisibility() {
        this.querySelectorAll('thead').forEach(element => {
          if (!element.nextSibling?.innerHTML) {
            element.classList.add('hidden')
          }
        })
      }

      setBackStatus() {
        const pageUrl = new URL(location.href)
        const backUrl = pageUrl.searchParams.get('back')
        this.querySelectorAll('.js-comparison-back-trigger').forEach(element => {
          element.setAttribute('href', backUrl)
        })
      }

      get productExcludeTriggers() {
        return this.querySelectorAll('.js-product-exclude')
      }

      get modalTriggers() {
        return this.querySelectorAll('.js-modal-trigger')
      }

      get modals() {
        return this.querySelectorAll('.js-comparison-modal')
      }
    }
  );
}

if (!customElements.get('comparison-modal')) {
  customElements.define(
    'comparison-modal',
    class ComparisonModal extends HTMLElement {
      constructor() {
        super();

        this.closeTriggers.forEach(trigger => {
          trigger.addEventListener('click', (e) => this.close())
        })
      }

      open() {
        this.classList.add('active')
      }

      close() {
        this.classList.remove('active')
      }

      get closeTriggers() {
        return this.querySelectorAll('.js-close')
      }
    }
  );
}
