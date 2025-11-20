import React, { useEffect, useState } from "react";

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    console.log("User choice:", choice.outcome);

    setVisible(false);
    setDeferredPrompt(null);
  };

  const closePrompt = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.sheet}>
        <button style={styles.closeBtn} onClick={closePrompt}>×</button>
        <h3 style={styles.title}>Install Bhungane CRM</h3>

        <p style={styles.message}>
          Install the app for faster access and a smoother experience.
        </p>

        <button style={styles.installBtn} onClick={installApp}>
          Install Now
        </button>
      </div>
    </div>
  );
};

// ---- Inline CSS With Animation ---- //
const styles = {
  overlay: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.2)",
    backdropFilter: "blur(1px)",
    animation: "fadeIn 0.3s ease",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 9999,
  },

  sheet: {
    width: "100%",
    background: "#fff",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
    padding: "20px",
    boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
    animation: "slideUp 0.35s ease",
    position: "relative",
    textAlign: "center",
  },

  closeBtn: {
    position: "absolute",
    right: "20px",
    top: "12px",
    fontSize: "24px",
    background: "none",
    border: "none",
    cursor: "pointer",
  },

  title: {
    margin: "10px 0 5px",
    fontSize: "20px",
    fontWeight: "bold",
  },

  message: {
    fontSize: "15px",
    margin: "5px 0 20px",
    color: "#333",
  },

  installBtn: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
};

// ---- Add animations to the page ---- //
const stylesSheet = document.styleSheets[0];
stylesSheet.insertRule(`
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to { transform: translateY(0); }
  }
`, stylesSheet.cssRules.length);

stylesSheet.insertRule(`
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`, stylesSheet.cssRules.length);

export default InstallPrompt;
