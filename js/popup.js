const SELECT_ACTIVE_CLASS_NAME = 'focused';
const DROPDOWN_ITEM_ACTIVE_CLASS_NAME = 'active';

function settingInit() {
  getStored(data => {
    console.log(`stored data --->`, data);
    Object.entries(SUPPORTED_SETTING).forEach(([key, map]) => {
      const select = document.getElementById(key);
      const input = select.querySelector('input');
      const dropdown = select.querySelector('.dropdown-list');
      const activeKey = data[key];

      input.value = map[activeKey];
      Object.entries(map).forEach(option => {
        const li = document.createElement('li');

        li.className = 'dropdown-item';
        activeKey === option[0] && li.classList.add(DROPDOWN_ITEM_ACTIVE_CLASS_NAME);
        li.dataset.role = 'select-dropdown-item';
        li.dataset.value = option[0];
        li.innerText = option[1];
        dropdown.appendChild(li);
      });
    });
  });
}

function listenerInit() {
  let activeSelect = null;

  const activateSelect = target => {
    if (!target) return;

    !target.classList.contains(SELECT_ACTIVE_CLASS_NAME)
      && target.classList.add(SELECT_ACTIVE_CLASS_NAME);
    activeSelect = target;
  };

  const deactivateSelect = target => {
    if (!target) return;

    target.classList.contains(SELECT_ACTIVE_CLASS_NAME)
      && target.classList.remove(SELECT_ACTIVE_CLASS_NAME);
  };

  const updateStored = target => {
    if (!target.classList.contains(DROPDOWN_ITEM_ACTIVE_CLASS_NAME)) {
      const value = target.dataset.value;
      const select = target.parentElement.parentElement.parentElement;
      const input = select.querySelector('input');
      const dropdown = select.querySelector('.dropdown-list');

      input.value = SUPPORTED_SETTING[select.id][value];
      [...dropdown.children].forEach(child => {
        child.classList[child === target ? 'add' : 'remove'](DROPDOWN_ITEM_ACTIVE_CLASS_NAME);
      });
      setStored({ [select.id]: value });
    }
  };

  document.addEventListener('click', ({ target }) => {
    switch (target.dataset.role) {
      case 'select-trigger':
        deactivateSelect(activeSelect);
        activateSelect(target.parentElement.parentElement);
        break;

      case 'select-dropdown-list':
        // do nothing
        break;

      case 'select-dropdown-item':
        updateStored(target);
        deactivateSelect(target.parentElement.parentElement.parentElement);
        break;

      default:
        deactivateSelect(activeSelect);
        activeSelect = null;
        break;
    }
  });
}

function popupInit() {
  settingInit();
  listenerInit();
};

popupInit();
