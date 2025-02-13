// @ts-nocheck

// Required to use trusted types for executing scripts
const ttPolicy = trustedTypes.createPolicy('ttPolicy', {
  createScript: (s) => s,
  createScriptURL: (s) => {
    if (
      s.includes('http://localhost') ||
      s.includes('127.0.0.1') ||
      s.charAt(0) === '/'
    ) {
      return s;
    }
    return '';
  },
  createHTML: (s) => s,
});

// Service worker registration & update
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(ttPolicy.createScriptURL('/sw.js'))
    .then((registration) => {
      navigator.serviceWorker.addEventListener('controllerchange', () =>
        window.location.reload()
      );
      navigator.serviceWorker.addEventListener('message', ({ data }) => {
        if (data?.action === 'reload') {
          window.location.reload();
        }
      });

      registration.addEventListener('updatefound', () => {
        if (registration.installing) {
          // wait until the new Service worker is actually installed (ready to take over)
          registration.installing.addEventListener('statechange', () => {
            const message = { action: 'skip_waiting' };
            registration.waiting?.postMessage(message);
          });
        }
      });
    });

  navigator.serviceWorker.getRegistration().then((registration) => {
    registration.addEventListener('updatefound', () => {
      if (registration.installing) {
        // wait until the new Service worker is actually installed (ready to take over)
        registration.installing.addEventListener('statechange', () => {
          const message = { action: 'skip_waiting' };
          registration.waiting?.postMessage(message);
        });
      }
    });

    setInterval(() => registration.update(), 3000);
  });
}

const resurrect = () => {
  // Re-initialize the controlled frame
  initializeControlledFrame();
};

const initializeControlledFrame = () => {
  let controlledFrame = document.getElementById('controlled-frame');

  if (controlledFrame) controlledFrame.remove();

  controlledFrame = document.createElement('ControlledFrame');
  controlledFrame.setAttribute('id', 'controlled-frame');
  // To test resurrection, use a js-crasher url
  controlledFrame.setAttribute(
    'src',
    'https://iwa-controlled-frame-poc-js-crasher.vercel.app'
  );
  controlledFrame.setAttribute('partition', 'persist:controlledframe');

  // Register controlled frame event
  controlledFrame.addEventListener('exit', (e) => {
    console.error('Exit event fired', e);
    document.getElementById('resurrectButton').style.display = 'block';
  });
  controlledFrame.addEventListener('unresponsive', (e) => {
    console.error('unresponsive event fired', e);
    document.getElementById('resurrectButton').style.display = 'block';
  });
  controlledFrame.addEventListener('responsive', (e) => {
    console.log('responsive event fired', e);
    document.getElementById('resurrectButton').style.display = 'none';
  });

  document
    .getElementById('controlledframe-container')
    .appendChild(controlledFrame);
};

document.addEventListener('DOMContentLoaded', () => {
  // Add click event listener to the resurrect button
  const resurrectButton = document.getElementById('resurrectButton');
  resurrectButton.addEventListener('click', () => {
    resurrect();
    // Hide the button after click
    resurrectButton.style.display = 'none';
  });

  initializeControlledFrame();
});
