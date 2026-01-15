class TeamMembers extends HTMLElement {
  constructor() {
    super()

    this.triggers.forEach(trigger => {
      trigger.addEventListener('click', this.modalOpen.bind(this))
    })

    this.closeTriggers.forEach(trigger => {
      trigger.addEventListener('click', this.modalClose.bind(this))
    })

    this.addEventListener('keyup', (evt) => {
      if (evt.code === 'Escape') {
        this.modals.forEach(modal => {
          modal?.classList.remove('active')
        })
        this.onModalClose()
      }
    })
  }

  modalOpen (e) {
    const modalId = e.currentTarget?.getAttribute('data-index')
    this.modals.forEach(modal => {
      if (modal.getAttribute('data-index') == modalId) {
        modal.classList.add('active')
      } else {
        modal.classList.remove('active')
      }
    })
    this.onModalOpen()
  }

  modalClose (e) {
    const modal = e.target.closest('.js-modal')
    modal?.classList.remove('active')
    this.onModalClose()
  }

  onModalOpen () {
    document.body.classList.add('overflow-hidden');
    document.querySelector('.header-wrapper').style.display = 'none';
    document.querySelector('.footer').style.display = 'none';
  }

  onModalClose () {
    document.body.classList.remove('overflow-hidden');
    document.querySelector('.header-wrapper').style.display = '';
    document.querySelector('.footer').style.display = '';
  }

  get triggers () {
    return this.querySelectorAll('.js-modal-trigger')
  }

  get closeTriggers () {
    return this.querySelectorAll('.js-modal-close')
  }

  get modals () {
    return this.querySelectorAll('.js-modal')
  }
}

customElements.define('team-members', TeamMembers)
