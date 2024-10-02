let rootElement = null;
let currentComponent = null;
let currentVDOM = null;
let stateIndex = 0;
let states = [];

// create the html
function createElement(vNode) {
  if (typeof vNode === 'string') {
    return document.createTextNode(vNode);
  }

  const { tag, text, attributes, events, children, ref } = vNode;
  const element = document.createElement(tag);

  if (text) {
    element.textContent = text;
  }

  if (attributes) {
    Object.keys(attributes).forEach(attr => {
      element.setAttribute(attr, attributes[attr]);
    });
  }

  if (events) {
    Object.keys(events).forEach(event => {
      element.addEventListener(event, events[event]);
    });
  }

  if (ref) {
    ref.current = element; 
  }

  // recursively add other childrens
  if (children) {
    children.forEach(child => {
      element.appendChild(createElement(child));
    });
  }

  return element;
}

// shove the generated html into real dom
function render(vNode, container) {
  container.innerHTML = ''; // reset container. why not use replace?
  container.appendChild(createElement(vNode));
}

// rerender when the state changes
function reRender() {
  stateIndex = 0; // i'll understand this line in about 69 years...
  const newVDOM = currentComponent();
  render(newVDOM, rootElement); 
  currentVDOM = newVDOM;
}

// the only thing i need from react xd
function val(initialValue) {
  const localIndex = stateIndex;
  states[localIndex] = states[localIndex] !== undefined ? states[localIndex] : initialValue;
  
  const set = (newValue) => {    
    states[localIndex] = newValue;
    reRender(); 
  };
  
  stateIndex++;
  return [states[localIndex], set];
}

// the only (second) thing i need from react xd
function ref(initialValue) {
  return { current: initialValue };
}


// mount sounds wrong, can we call it something else?
function mount(component, container) {
  rootElement = container;
  currentComponent = component;
  reRender();
}

// if this export list gets bigger, i'll go back to react. pinky promise!
export { mount, val, ref };
