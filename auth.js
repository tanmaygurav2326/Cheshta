/* =========================================================
   MyBank - Authentication
   File: auth.js

   DEMO ONLY
   Customer ID: demo123
   Password: bank@123
   ========================================================= */


/* =========================
   1. DEMO USER
   ========================= */

const DEMO_USER = {
    customerId: "demo123",
    password: "bank@123",
    name: "Tanmay Gurav",
    email: "tanmaygurav2326@gmail.com"
};


/* =========================
   2. ELEMENTS
   ========================= */

const loginForm = document.getElementById("loginForm");
const customerIdInput = document.getElementById("customerId");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");
const rememberMe = document.getElementById("rememberMe");
const forgotPassword = document.getElementById("forgotPassword");


/* =========================
   3. SHOW / HIDE PASSWORD
   ========================= */

if (togglePassword) {

    togglePassword.addEventListener("click", function () {

        const isPassword =
            passwordInput.type === "password";

        if (isPassword) {

            passwordInput.type = "text";

            togglePassword.textContent = "🙈";

            togglePassword.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type = "password";

            togglePassword.textContent = "👁";

            togglePassword.setAttribute(
                "aria-label",
                "Show password"
            );
        }

    });

}


/* =========================
   4. DISPLAY MESSAGE
   ========================= */

function showMessage(message, type) {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = message;

    loginMessage.className =
        "login-message " + type;
}


/* =========================
   5. CLEAR MESSAGE
   ========================= */

function clearMessage() {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = "";

    loginMessage.className =
        "login-message";
}


/* =========================
   6. LOGIN
   ========================= */

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        clearMessage();

        const customerId =
            customerIdInput.value.trim();

        const password =
            passwordInput.value;

        /* Validate empty fields */

        if (!customerId || !password) {

            showMessage(
                "Please enter your Customer ID and password.",
                "error"
            );

            return;
        }


        /* Disable button while checking */

        loginButton.disabled = true;

        loginButton.querySelector("span").textContent =
            "Signing in...";


        /*
         * Small delay for demo purposes.
         * Real authentication should happen
         * on a secure server.
         */

        setTimeout(function () {

            if (
                customerId === DEMO_USER.customerId &&
                password === DEMO_USER.password
            ) {

                /* =========================
                   LOGIN SUCCESS
                   ========================= */

                const session = {
                    loggedIn: true,
                    customerId: DEMO_USER.customerId,
                    name: DEMO_USER.name,
                    email: DEMO_USER.email,
                    loginTime: Date.now()
                };


                /*
                 * Store only demo session data.
                 *
                 * DO NOT store real passwords,
                 * banking information, or secrets
                 * in localStorage.
                 */

                if (rememberMe.checked) {

                    localStorage.setItem(
                        "mybankSession",
                        JSON.stringify(session)
                    );

                } else {

                    sessionStorage.setItem(
                        "mybankSession",
                        JSON.stringify(session)
                    );
                }


                showMessage(
                    "Login successful. Redirecting...",
                    "success"
                );


                /*
                 * Redirect to dashboard.
                 */

                setTimeout(function () {

                    window.location.href =
                        "dashboard.html";

                }, 700);


            } else {

                /* =========================
                   LOGIN FAILED
                   ========================= */

                showMessage(
                    "Invalid Customer ID or password.",
                    "error"
                );

                loginButton.disabled = false;

                loginButton.querySelector("span").textContent =
                    "Sign In";

                passwordInput.value = "";

                passwordInput.focus();

            }

        }, 500);

    });

}


/* =========================
   7. FORGOT PASSWORD
   ========================= */

if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            alert(
                "This is a demo banking application.\n\n" +
                "Password recovery is not connected to a real service."
            );

        }
    );

}


/* =========================
   8. GET CURRENT SESSION
   ========================= */

function getSession() {

    const localSession =
        localStorage.getItem("mybankSession");

    const temporarySession =
        sessionStorage.getItem("mybankSession");


    const session =
        localSession || temporarySession;


    if (!session) {
        return null;
    }


    try {

        return JSON.parse(session);

    } catch (error) {

        console.error(
            "Invalid session data."
        );

        clearSession();

        return null;
    }
}


/* =========================
   9. CHECK LOGIN
   ========================= */

function isLoggedIn() {

    const session = getSession();

    return session !== null &&
           session.loggedIn === true;
}


/* =========================
   10. PROTECT PAGE
   ========================= */

function protectPage() {

    if (!isLoggedIn()) {

        window.location.href =
            "index.html";

    }

}


/* =========================
   11. LOGOUT
   ========================= */

function logout() {

    localStorage.removeItem(
        "mybankSession"
    );

    sessionStorage.removeItem(
        "mybankSession"
    );


    window.location.href =
        "index.html";
}


/* =========================
   12. CLEAR SESSION
   ========================= */

function clearSession() {

    localStorage.removeItem(
        "mybankSession"
    );

    sessionStorage.removeItem(
        "mybankSession"
    );

}


/* =========================
   13. SESSION TIMEOUT
   ========================= */

/*
 * Demo timeout:
 * 30 minutes of session lifetime.
 *
 * A real application should use
 * server-side session expiration.
 */

const SESSION_TIMEOUT =
    30 * 60 * 1000;


function checkSessionTimeout() {

    const session = getSession();

    if (!session) {
        return;
    }


    const currentTime =
        Date.now();

    const loginTime =
        Number(session.loginTime);


    if (
        currentTime - loginTime >
        SESSION_TIMEOUT
    ) {

        clearSession();

        alert(
            "Your demo session has expired. Please sign in again."
        );

        window.location.href =
            "index.html";
    }

}


/* Check session periodically */

setInterval(
    checkSessionTimeout,
    60 * 1000
);


/* Check once when page loads */

checkSessionTimeout();


/* =========================================================
   EXPORT-STYLE GLOBAL FUNCTIONS

   These functions are available to other HTML pages
   because normal browser scripts share the page scope.
   ========================================================= */

window.getSession = getSession;
window.isLoggedIn = isLoggedIn;
window.protectPage = protectPage;
window.logout = logout;
window.clearSession = clearSession;
