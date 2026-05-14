# Emails automatiques – Dar Baraï

## Provider : Resend

Le projet utilise [Resend](https://resend.com) comme service d'envoi d'emails.

**Variables d'environnement requises**
```
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=reservations@darbarai.com
RESEND_FROM_NAME="Dar Baraï Marrakech"
```
Si `RESEND_API_KEY` est absent, les envois sont silencieusement ignorés (pas d'erreur).

---

## Emails existants

### Potentiellement gérés par Supabase (hors codebase)
Supabase Auth envoie par défaut ces emails via son propre système — **à vérifier dans ton dashboard** → *Authentication → Email Templates*.

| Email | Déclencheur |
|-------|-------------|
| Confirmation de compte | Inscription |
| Réinitialisation de mot de passe | "Mot de passe oublié" |

> Ces templates sont peut-être personnalisés, désactivés, ou délégués à un SMTP custom dans ton dashboard. Je n'ai pas accès à cette configuration.

---

### Gérés par le code du projet (Resend)

### 1. Confirmation de réservation (après paiement Stripe)
**Fichier :** `app/server/api/stripe/webhook.post.ts`  
**Déclencheur :** Webhook Stripe `payment_intent.succeeded`  
**Destinataire :** Client  
**Contenu :** Riad, dates, durée, nb voyageurs, total payé  
**Langue :** Français uniquement (template inline HTML)

> ⚠️ Stripe n'étant pas encore configuré en production, cet email ne part pas encore.

---

### 2. Newsletter
**Fichier :** `app/server/api/newsletter/send.post.ts`  
**Déclencheur :** Manuel — bouton dans `/admin/newsletter`  
**Destinataires :** Tous les profils avec `newsletter_subscribed = true`  
**Contenu :** Libre (HTML saisi par l'admin, FR + EN)  
**Limite :** Envois par batch de 50 (contrainte plan gratuit Resend)

---

## Emails manquants (à implémenter)

| Email | Déclencheur | Priorité |
|-------|-------------|----------|
| Confirmation "payer plus tard" | Réservation créée sans Stripe | 🔴 Haute |
| Notification admin – nouvelle réservation | Idem | 🔴 Haute |
| Annulation par le client | Client annule depuis son espace | 🟡 Moyenne |
| Annulation par l'admin | Admin annule depuis le back-office | 🟡 Moyenne |
| Rappel avant arrivée | Cron J-3 ou J-7 | 🟢 Basse |

---

## Architecture technique

```
Événement (webhook / action user / cron)
        ↓
app/server/api/...
        ↓
new Resend(config.resendApiKey)
        ↓
resend.emails.send({ from, to, subject, html })
```

Les templates sont actuellement du **HTML inline** dans chaque route serveur — pas de système de template partagé. Si on ajoute plusieurs emails, il faudra extraire une fonction `renderEmail(type, data)` pour éviter la duplication.

---

## Adresse expéditeur

`Dar Baraï Marrakech <reservations@darbarai.com>`

Le domaine `darbarai.com` doit être **vérifié dans Resend** (DNS) pour que les emails ne tombent pas en spam.

---

## Prochaine étape suggérée

Implémenter en priorité :
1. **Email client** à la création d'une réservation "payer plus tard" (`clientSecret === null`)
2. **Email admin** pour être notifié de chaque nouvelle réservation (peu importe le mode de paiement)
