let deferredPrompt; // Declare this variable at the top level of your script.

const butInstall = document.getElementById("buttonInstall");

// Logic for installing the PWA
window.addEventListener("beforeinstallprompt", (event) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    event.preventDefault();

    // Stash the event so it can be triggered later.
    deferredPrompt = event;

    // Update UI to notify the user they can add to home screen
    butInstall.style.display = "block";
});

butInstall.addEventListener("click", async () => {
    if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, discard it
        deferredPrompt = null;
    }

    // Hide the install button
    butInstall.style.display = "none";
});

window.addEventListener("appinstalled", (event) => {
    // Log the installation to analytics or save the event somehow
    console.log("PWA was installed", event);

    // Clear the deferredPrompt since it can't be used again
    deferredPrompt = null;
});
