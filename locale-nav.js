(function () {
  const LOCALES = ["en", "nl", "ro", "pl", "es", "fr", "pt", "de"];
  const NAMES = {
    en: "English",
    nl: "Nederlands",
    ro: "Română",
    pl: "Polski",
    es: "Español",
    fr: "Français",
    pt: "Português",
    de: "Deutsch",
  };
  const TABS = {
    en: { start: "Start here", parcels: "Parcels", pallets: "Pallets", truckloads: "Truckloads", support: "Support" },
    nl: { start: "Begin hier", parcels: "Pakketten", pallets: "Paletten", truckloads: "Complete ladingen", support: "Hulp" },
    ro: { start: "Începeți aici", parcels: "Colete", pallets: "Paleți", truckloads: "Transporturi complete", support: "Asistență" },
    pl: { start: "Zacznij tutaj", parcels: "Paczki", pallets: "Palety", truckloads: "Ładunki kompletne", support: "Wsparcie" },
    es: { start: "Empiece aquí", parcels: "Paquetes", pallets: "Palets", truckloads: "Cargas completas", support: "Ayuda" },
    fr: { start: "Commencez ici", parcels: "Colis", pallets: "Palettes", truckloads: "Chargements complets", support: "Assistance" },
    pt: { start: "Comece aqui", parcels: "Encomendas", pallets: "Paletes", truckloads: "Cargas completas", support: "Apoio" },
    de: { start: "Hier beginnen", parcels: "Pakete", pallets: "Paletten", truckloads: "Komplettladungen", support: "Hilfe" },
  };
  const TAB_NAMES = {};
  Object.keys(TABS).forEach(function (locale) {
    Object.keys(TABS[locale]).forEach(function (key) {
      TAB_NAMES[TABS[locale][key]] = key;
    });
  });
  const PAGES = {"index":{"en":"Arrowline Portal Help Center","nl":"Arrowline Portal Helpcentrum","ro":"Centrul de ajutor Arrowline Portal","pl":"Centrum pomocy Arrowline Portal","es":"Centro de ayuda del Arrowline Portal","fr":"Centre d'aide Arrowline Portal","pt":"Centro de Ajuda do Arrowline Portal","de":"Arrowline Portal Hilfe-Center"},"pallets/claims":{"en":"Pallet claims","nl":"Claims in Paletten","ro":"Reclamații Paleți","pl":"Reklamacje Paleta","es":"Reclamaciones de Palets","fr":"Réclamations Palettes","pt":"Reclamações Paletes","de":"Claims in Paletten"},"pallets/incoming-orders":{"en":"Incoming pallet orders","nl":"Incoming palletorders","ro":"Incoming Orders pentru paleți","pl":"Przychodzące zamówienia paletowe","es":"Pedidos Incoming de Palets","fr":"Incoming orders de palettes","pt":"Encomendas Incoming de paletes","de":"Incoming-Aufträge in Paletten"},"pallets/overview":{"en":"Pallets in the portal","nl":"Paletten in het portaal","ro":"Paleți în portal","pl":"Palety w portalu","es":"Palets en el portal","fr":"Palettes dans le portail","pt":"Paletes no portal","de":"Paletten im Portal"},"pallets/package-detail":{"en":"Pallet package details","nl":"Pakketdetails in Paletten","ro":"Detalii pachet Paleți","pl":"Szczegóły paczki Paleta","es":"Detalles del paquete de Palets","fr":"Détails d'un colis Palettes","pt":"Detalhes do volume Paletes","de":"Paketdetails in Paletten"},"pallets/proof-of-delivery":{"en":"Proof of delivery","nl":"Leveringsbewijs","ro":"Dovada de livrare","pl":"Potwierdzenie dostawy","es":"Comprobante de entrega","fr":"Preuve de livraison","pt":"Comprovativo de entrega","de":"Liefernachweis"},"pallets/public-tracking":{"en":"Track a pallet without signing in","nl":"Een pallet volgen zonder in te loggen","ro":"Urmăriți un palet fără autentificare","pl":"Śledzenie palety bez logowania","es":"Siga un palet sin iniciar sesión","fr":"Suivre une palette sans se connecter","pt":"Seguir uma palete sem iniciar sessão","de":"Eine Palette ohne Anmeldung verfolgen"},"pallets/shipment-detail":{"en":"Pallet shipment details","nl":"Zendingsdetails in Paletten","ro":"Detalii expediere Paleți","pl":"Szczegóły przesyłki Paleta","es":"Detalles del envío de Palets","fr":"Détails d'une expédition Palettes","pt":"Detalhes do envio Paletes","de":"Sendungsdetails in Paletten"},"pallets/shipments":{"en":"Pallet shipments","nl":"Palletzendingen","ro":"Expedieri Paleți","pl":"Przesyłki Paleta","es":"Envíos de Palets","fr":"Expéditions Palettes","pt":"Envios Paletes","de":"Sendungen in Paletten"},"pallets/statuses":{"en":"Pallet statuses","nl":"Statussen in Paletten","ro":"Statusuri Paleți","pl":"Statusy Paleta","es":"Estados de Palets","fr":"Statuts Palettes","pt":"Estados Paletes","de":"Status in Paletten"},"pallets/tickets":{"en":"Pallet tickets","nl":"Tickets in Paletten","ro":"Tichete Paleți","pl":"Zgłoszenia Paleta","es":"Tickets de Palets","fr":"Tickets Palettes","pt":"Tickets Paletes","de":"Tickets in Paletten"},"parcels/claims":{"en":"Parcel claims","nl":"Claims in Pakketten","ro":"Reclamații Colete","pl":"Reklamacje Paczka","es":"Reclamaciones de Paquetes","fr":"Réclamations Colis","pt":"Reclamações Encomendas","de":"Claims in Pakete"},"parcels/delivery-exceptions":{"en":"Delivery exceptions","nl":"Leveringsuitzonderingen","ro":"Excepții de livrare","pl":"Wyjątki dostawy","es":"Excepciones de entrega","fr":"Exceptions de livraison","pt":"Exceções de entrega","de":"Lieferausnahmen"},"parcels/overview":{"en":"Parcels in the portal","nl":"Pakketten in het portaal","ro":"Colete în portal","pl":"Paczki w portalu","es":"Paquetes en el portal","fr":"Colis dans le portail","pt":"Encomendas no portal","de":"Pakete im Portal"},"parcels/performance":{"en":"Parcel performance report","nl":"Prestatierapport van Pakketten","ro":"Raportul de performanță Colete","pl":"Raport wyników Paczka","es":"Informe de rendimiento de Paquetes","fr":"Rapport de performance Colis","pt":"Relatório de desempenho Encomendas","de":"Performance-Bericht für Pakete"},"parcels/returns":{"en":"Parcel returns","nl":"Retours in Pakketten","ro":"Retururi Colete","pl":"Zwroty Paczka","es":"Devoluciones de Paquetes","fr":"Retours Colis","pt":"Devoluções Encomendas","de":"Retouren in Pakete"},"parcels/shipment-detail":{"en":"Review a parcel","nl":"Een pakketzending bekijken","ro":"Consultați un colet","pl":"Przegląd przesyłki paczka","es":"Revise un envío de Paquetes","fr":"Consulter un colis","pt":"Consultar uma encomenda","de":"Eine Paketsendung prüfen"},"parcels/shipments":{"en":"Parcel shipments","nl":"Parcelzendingen","ro":"Expedieri Colete","pl":"Przesyłki Paczka","es":"Envíos de Paquetes","fr":"Expéditions Colis","pt":"Envios Encomendas","de":"Sendungen in Pakete"},"parcels/statuses":{"en":"Parcel statuses","nl":"Statussen in Pakketten","ro":"Statusuri Colete","pl":"Statusy Paczka","es":"Estados de Paquetes","fr":"Statuts Colis","pt":"Estados Encomendas","de":"Status in Pakete"},"parcels/tickets":{"en":"Parcel tickets","nl":"Tickets in Pakketten","ro":"Tichete Colete","pl":"Zgłoszenia Paczka","es":"Tickets de Paquetes","fr":"Tickets Colis","pt":"Tickets Encomendas","de":"Tickets in Pakete"},"parcels/tracking":{"en":"Track a parcel","nl":"Een pakketzending volgen","ro":"Urmăriți un colet","pl":"Śledzenie przesyłki paczka","es":"Siga un envío de Paquetes","fr":"Suivre un colis","pt":"Seguir uma encomenda","de":"Eine Paketsendung verfolgen"},"portal/filters-and-exports":{"en":"Use filters and exports","nl":"Filters en exports gebruiken","ro":"Folosiți filtrele și exporturile","pl":"Filtry i eksporty","es":"Use filtros y exportaciones","fr":"Utiliser les filtres et les exports","pt":"Utilizar filtros e exportações","de":"Filter und Exporte verwenden"},"portal/searching":{"en":"Search for a shipment","nl":"Een zending zoeken","ro":"Căutați o expediere","pl":"Wyszukiwanie przesyłki","es":"Busque un envío","fr":"Rechercher une expédition","pt":"Pesquisar um envio","de":"Eine Sendung suchen"},"portal/shipment-details":{"en":"Read shipment details","nl":"Zendingsdetails lezen","ro":"Citiți detaliile expedierii","pl":"Odczyt szczegółów przesyłki","es":"Lea los detalles del envío","fr":"Lire les détails d'une expédition","pt":"Ler os detalhes do envio","de":"Sendungsdetails lesen"},"portal/statuses":{"en":"Understand shipment statuses","nl":"Zendingsstatussen begrijpen","ro":"Înțelegeți statusurile expedierii","pl":"Zrozumienie statusów przesyłek","es":"Entienda los estados de envío","fr":"Comprendre les statuts d'expédition","pt":"Compreender os estados do envio","de":"Sendungsstatus verstehen"},"start/account":{"en":"Manage your account","nl":"Uw account beheren","ro":"Gestionați-vă contul","pl":"Zarządzanie kontem","es":"Gestione su cuenta","fr":"Gérer votre compte","pt":"Gerir a sua conta","de":"Ihr Konto verwalten"},"start/choose-your-workflow":{"en":"Choose your workflow","nl":"Kies uw werkwijze","ro":"Alegeți fluxul de lucru","pl":"Wybór przepływu pracy","es":"Elija su flujo de trabajo","fr":"Choisir votre flux de travail","pt":"Escolher o fluxo de trabalho","de":"Wählen Sie Ihren Arbeitsablauf"},"start/dashboard":{"en":"Understand the dashboard","nl":"Het dashboard begrijpen","ro":"Înțelegeți tabloul de bord","pl":"Poznaj pulpit","es":"Entienda el dashboard","fr":"Comprendre le tableau de bord","pt":"Compreender o painel","de":"Das Dashboard verstehen"},"start/password-reset":{"en":"Reset your password","nl":"Uw wachtwoord opnieuw instellen","ro":"Resetați parola","pl":"Resetowanie hasła","es":"Restablezca su contraseña","fr":"Réinitialiser votre mot de passe","pt":"Redefinir a palavra-passe","de":"Passwort zurücksetzen"},"start/sign-in":{"en":"Sign in to the portal","nl":"Inloggen op het portaal","ro":"Autentificare în portal","pl":"Logowanie do portalu","es":"Inicie sesión en el portal","fr":"Se connecter au portail","pt":"Iniciar sessão no portal","de":"Am Portal anmelden"},"support/cannot-sign-in":{"en":"I cannot sign in","nl":"Ik kan niet inloggen","ro":"Nu mă pot autentifica","pl":"Nie mogę się zalogować","es":"No puedo iniciar sesión","fr":"Je ne peux pas me connecter","pt":"Não consigo iniciar sessão","de":"Ich kann mich nicht anmelden"},"support/contact":{"en":"Contact Arrowline Support","nl":"Contact met Arrowline Support","ro":"Contactați Arrowline Support","pl":"Kontakt z Arrowline Support","es":"Póngase en contacto con Arrowline Support","fr":"Contacter Arrowline Support","pt":"Contactar a Arrowline Support","de":"Arrowline Support kontaktieren"},"support/create-ticket":{"en":"Create a support ticket","nl":"Een supportticket aanmaken","ro":"Creați un tichet de asistență","pl":"Utworzenie zgłoszenia wsparcia","es":"Cree un ticket de soporte","fr":"Créer un ticket de support","pt":"Criar um ticket de apoio","de":"Ein Support-Ticket erstellen"},"support/portal-errors":{"en":"Portal errors","nl":"Portaalfouten","ro":"Erori în portal","pl":"Błędy portalu","es":"Errores del portal","fr":"Erreurs du portail","pt":"Erros do portal","de":"Portalfehler"},"support/required-information":{"en":"Information Support needs","nl":"Informatie die Support nodig heeft","ro":"Informațiile de care are nevoie Support","pl":"Informacje potrzebne Supportowi","es":"Información que Support necesita","fr":"Informations dont Support a besoin","pt":"Informação de que a Support precisa","de":"Angaben, die Support braucht"},"support/shipment-not-found":{"en":"A shipment cannot be found","nl":"Een zending kan niet worden gevonden","ro":"O expediere nu poate fi găsită","pl":"Nie można znaleźć przesyłki","es":"No se encuentra un envío","fr":"Une expédition est introuvable","pt":"Não é possível encontrar um envio","de":"Eine Sendung wird nicht gefunden"},"support/status-not-updated":{"en":"A shipment status is not updated","nl":"Een zendingsstatus is niet bijgewerkt","ro":"Statusul unei expedieri nu este actualizat","pl":"Status przesyłki nie jest aktualizowany","es":"El estado de un envío no se actualiza","fr":"Le statut d'une expédition n'est pas mis à jour","pt":"O estado de um envio não é atualizado","de":"Ein Sendungsstatus wird nicht aktualisiert"},"support/track-ticket":{"en":"Follow up on a ticket","nl":"Een ticket opvolgen","ro":"Urmăriți un tichet","pl":"Kontynuacja zgłoszenia","es":"Haga el seguimiento de un ticket","fr":"Suivre un ticket","pt":"Acompanhar um ticket","de":"Ein Ticket weiterverfolgen"},"truckloads/overview":{"en":"Truckloads in the portal","nl":"Complete ladingen in het portaal","ro":"Transporturi complete în portal","pl":"Ładunki kompletne w portalu","es":"Cargas completas en el portal","fr":"Chargements complets dans le portail","pt":"Cargas completas no portal","de":"Komplettladungen im Portal"},"truckloads/performance":{"en":"Truckload performance report","nl":"Prestatierapport van Complete ladingen","ro":"Raportul de performanță Transporturi complete","pl":"Raport wyników Ładunek kompletny","es":"Informe de rendimiento de Cargas completas","fr":"Rapport de performance Chargements complets","pt":"Relatório de desempenho Cargas completas","de":"Performance-Bericht für Komplettladungen"},"truckloads/shipment-detail":{"en":"Review a truckload","nl":"Een transport bekijken","ro":"Consultați un transport complet","pl":"Przegląd ładunku kompletnego","es":"Revise una carga completa","fr":"Consulter un transport","pt":"Consultar uma carga completa","de":"Einen Transport prüfen"},"truckloads/shipments":{"en":"Truckload shipments","nl":"Truckloadzendingen","ro":"Expedieri Transporturi complete","pl":"Przesyłki Ładunek kompletny","es":"Envíos de Cargas completas","fr":"Expéditions Chargements complets","pt":"Envios Cargas completas","de":"Sendungen in Komplettladungen"},"truckloads/statuses":{"en":"Truckload statuses","nl":"Statussen in Complete ladingen","ro":"Statusuri Transporturi complete","pl":"Statusy Ładunek kompletny","es":"Estados de Cargas completas","fr":"Statuts Chargements complets","pt":"Estados Cargas completas","de":"Status in Komplettladungen"}};
  const GROUPS = {"Welcome":{"en":"Welcome","nl":"Welkom","ro":"Bun venit","pl":"Witamy","es":"Bienvenida","fr":"Bienvenue","pt":"Bem-vindo","de":"Willkommen"},"Portal basics":{"en":"Portal basics","nl":"Portaalbasis","ro":"Bazele portalului","pl":"Podstawy portalu","es":"Conceptos básicos del portal","fr":"Bases du portail","pt":"Bases do portal","de":"Portalgrundlagen"},"Manage parcels":{"en":"Manage parcels","nl":"Pakketten beheren","ro":"Gestionare Colete","pl":"Zarządzanie Paczki","es":"Gestionar Paquetes","fr":"Gérer Colis","pt":"Gerir Encomendas","de":"Pakete verwalten"},"Problems and support":{"en":"Problems and support","nl":"Problemen en support","ro":"Probleme și suport","pl":"Problemy i wsparcie","es":"Problemas y soporte","fr":"Problèmes et support","pt":"Problemas e suporte","de":"Probleme und Support"},"Manage pallets":{"en":"Manage pallets","nl":"Paletten beheren","ro":"Gestionare Paleți","pl":"Zarządzanie Palety","es":"Gestionar Palets","fr":"Gérer Palettes","pt":"Gerir Paletes","de":"Paletten verwalten"},"Manage truckloads":{"en":"Manage truckloads","nl":"Complete ladingen beheren","ro":"Gestionare Transporturi complete","pl":"Zarządzanie Ładunki kompletne","es":"Gestionar Cargas completas","fr":"Gérer Chargements complets","pt":"Gerir Cargas completas","de":"Komplettladungen verwalten"},"Status and performance":{"en":"Status and performance","nl":"Status en prestaties","ro":"Status și performanță","pl":"Status i wyniki","es":"Estado y rendimiento","fr":"Statut et performance","pt":"Estado e desempenho","de":"Status und Leistung"},"Get help":{"en":"Get help","nl":"Hulp vragen","ro":"Cereți ajutor","pl":"Uzyskaj pomoc","es":"Pedir ayuda","fr":"Demander de l'aide","pt":"Pedir ajuda","de":"Hilfe anfordern"},"Troubleshooting":{"en":"Troubleshooting","nl":"Problemen oplossen","ro":"Depanare","pl":"Rozwiązywanie problemów","es":"Resolución de problemas","fr":"Dépannage","pt":"Resolução de problemas","de":"Fehlerbehebung"}};
  const GROUP_LOOKUP = {};
  Object.keys(GROUPS).forEach(function (englishName) {
    Object.keys(GROUPS[englishName]).forEach(function (locale) {
      GROUP_LOOKUP[GROUPS[englishName][locale]] = englishName;
    });
  });

  function segments(pathname) {
    return pathname.split("/").filter(Boolean);
  }

  function localeFromPath(pathname) {
    const first = segments(pathname)[0];
    return LOCALES.includes(first) ? first : "en";
  }

  function contentPath(pathname) {
    const parts = segments(pathname);
    if (LOCALES.includes(parts[0])) parts.shift();
    if (parts.length === 0 || (parts.length === 1 && parts[0] === "index")) return "";
    return parts.join("/");
  }

  function pathForLocale(pathname, locale) {
    const content = contentPath(pathname);
    if (locale === "en") return content ? "/" + content : "/";
    return content ? "/" + locale + "/" + content : "/" + locale;
  }

  function pathOnly(href) {
    if (!href) return "";
    try {
      const url = new URL(href.replace(/\\/g, "/"), location.origin);
      if (url.origin !== location.origin) return "";
      return url.pathname;
    } catch (error) {
      return "";
    }
  }

  function isInternalDocsPath(path) {
    return path.charAt(0) === "/" && path !== "/llms.txt" && !path.startsWith("/_next/");
  }

  function currentLocale() {
    return localeFromPath(location.pathname);
  }

  function mountSwitcher() {
    const navbar = document.getElementById("navbar");
    if (!navbar || document.getElementById("arrow-locale-switcher")) return;

    const select = document.createElement("select");
    select.id = "arrow-locale-switcher";
    select.setAttribute("aria-label", "Language");
    LOCALES.forEach(function (code) {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = NAMES[code];
      select.appendChild(option);
    });
    select.value = currentLocale();
    function go() {
      const next = pathForLocale(location.pathname, select.value);
      if (next !== location.pathname) location.assign(next);
    }
    select.addEventListener("change", go);
    select.addEventListener("input", go);
    navbar.appendChild(select);
  }

  function syncSwitcher() {
    const select = document.getElementById("arrow-locale-switcher");
    if (select && select.value !== currentLocale() && document.activeElement !== select) {
      select.value = currentLocale();
    }
  }

  function applyTabLabels() {
    const labels = TABS[currentLocale()];
    if (!labels) return;
    document.querySelectorAll("a[href]").forEach(function (anchor) {
      const key = TAB_NAMES[anchor.textContent.trim()];
      if (!key || !labels[key] || anchor.textContent.trim() === labels[key]) return;
      const path = pathOnly(anchor.getAttribute("href") || anchor.href);
      const section = contentPath(path).split("/")[0] || "start";
      const expected = key === "start" ? !section || section === "start" : section === key;
      if (expected) anchor.textContent = labels[key];
    });
  }


  function setLabel(el, label) {
    if (!el || !label || el.textContent.trim() === label) return;
    const textNodes = [];
    el.childNodes.forEach(function (node) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) textNodes.push(node);
    });
    if (textNodes.length === 1) {
      textNodes[0].textContent = label;
      return;
    }
    const leaf = el.querySelector("span, p");
    if (leaf && leaf.children.length === 0) {
      leaf.textContent = label;
      return;
    }
    el.textContent = label;
  }

  function sidebarRoots() {
    return document.querySelectorAll("#sidebar, #sidebar-content, #mobile-nav, #mobile-nav-content");
  }

  function applySidebarLabels() {
    const locale = currentLocale();
    sidebarRoots().forEach(function (root) {
      root.querySelectorAll("a[href]").forEach(function (anchor) {
        const key = contentPath(pathOnly(anchor.getAttribute("href") || anchor.href)) || "index";
        const label = PAGES[key] && PAGES[key][locale];
        if (label) setLabel(anchor, label);
      });
      root.querySelectorAll("h2, h3, h4").forEach(function (heading) {
        const englishName = GROUP_LOOKUP[heading.textContent.trim()];
        const label = englishName && GROUPS[englishName][locale];
        if (label) setLabel(heading, label);
      });
    });
  }

  function eventElement(event) {
    return event.target instanceof Element ? event.target : event.target.parentElement;
  }

  function keepLocaleLink(event) {
    const el = eventElement(event);
    if (!el) return;
    const locale = currentLocale();
    const item = el.closest("#localization-select-item, [id^='localization-select-item']");
    if (item) {
      const chosen = Object.keys(NAMES).find(function (code) {
        return NAMES[code] === item.textContent.trim();
      });
      if (chosen) {
        event.preventDefault();
        event.stopPropagation();
        const next = pathForLocale(location.pathname, chosen);
        if (next !== location.pathname) location.assign(next);
      }
      return;
    }

    const anchor = el.closest("a[href]");
    if (!anchor) return;
    const path = pathOnly(anchor.getAttribute("href") || anchor.href);
    if (!isInternalDocsPath(path)) return;
    const localized = pathForLocale(path, locale);
    if (localized === path) return;
    event.preventDefault();
    event.stopPropagation();
    if (localized !== location.pathname) location.assign(localized);
  }

  document.addEventListener("click", keepLocaleLink, true);
  window.addEventListener("popstate", syncSwitcher);

  function start() {
    mountSwitcher();
    syncSwitcher();
    applyTabLabels();
    applySidebarLabels();
  }

  start();
  window.setInterval(start, 500);
  const observer = new MutationObserver(start);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
