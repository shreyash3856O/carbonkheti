# CarbonKheti Translation Review Tracker

This document tracks the translation and localization audit status for all 11 supported Indic languages and English in CarbonKheti.

> **CRITICAL PRODUCTION GUARD**: All non-English language files (`*.json` in `/messages`) are currently designated with `"reviewStatus": "machine_draft"`. In accordance with platform governance, these machine drafts require native-speaker review by certified translators, local agricultural extension specialists, or FPO leadership before live field deployment.

---

## Language Matrix & Verification Status

| Code | Language | Script | Native Name | Status | Reviewer | Last Reviewed | Notes |
|:---:|:---|:---|:---|:---:|:---|:---:|:---|
| `en` | English | Latin | English | ✅ Approved | Core Team | 2025-01-01 | Source reference locale |
| `hi` | Hindi | Devanagari | हिन्दी | ⚠️ Machine Draft | Pending | — | Agricultural terminology verified against standard Kisan vocabulary |
| `mr` | Marathi | Devanagari | मराठी | ⚠️ Machine Draft | Pending | — | Tailored for Maharashtra FPOs (Vidarbha / Marathwada contexts) |
| `gu` | Gujarati | Gujarati | ગુજરાતી | ⚠️ Machine Draft | Pending | — | Cotton & groundnut region phrasing |
| `pa` | Punjabi | Gurmukhi | ਪੰਜਾਬੀ | ⚠️ Machine Draft | Pending | — | Paddy residue retention & happy seeder contexts |
| `ta` | Tamil | Tamil | தமிழ் | ⚠️ Machine Draft | Pending | — | Delta region AWD / DSR irrigation phrasing |
| `te` | Telugu | Telugu | తెలుగు | ⚠️ Machine Draft | Pending | — | Godavari / Krishna basin AWD terms |
| `kn` | Kannada | Kannada | ಕನ್ನಡ | ⚠️ Machine Draft | Pending | — | Dryland agroforestry & soil carbon terminology |
| `bn` | Bengali | Eastern Nagari | বাংলা | ⚠️ Machine Draft | Pending | — | Boro rice alternate wetting-drying terminology |
| `od` | Odia | Odia | ଓଡ଼ିଆ | ⚠️ Machine Draft | Pending | — | Coastal & tribal belt millets / agroforestry terms |
| `ml` | Malayalam | Malayalam | മലയാളം | ⚠️ Machine Draft | Pending | — | Homestead agroforestry and tree carbon terms |

---

## Review Guidelines for Native Contributors

1. **Clarity & Simplicity**: Ensure phrasing is natural for smallholder farmers with basic literacy. Avoid bureaucratic or overly technical English loanwords where familiar local terms exist.
2. **Key Terminologies**:
   - *Carbon Credit*: Ensure translations convey "certificate/credit for removing carbon" without sounding like an unpayable bank loan.
   - *Passbook*: Use familiar banking terminology (e.g., पासबुक, ਪਾਸਬੁੱਕ, பாஸ்புக், పాస్‌బుక్).
   - *Additionality & Baseline*: Keep field descriptions focused on "previous farming practice" and "new climate practice".
3. **Number Formatting**: Maintain Indian numbering standards (Lakhs and Crores, not Millions/Billions) and the Rupee symbol `₹`.
4. **Voice & Tone**: Respectful, encouraging, transparent, and legally non-deceptive. Estimates must always be marked as conditional on verification.
