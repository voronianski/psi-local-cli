# psi-local-cli

> [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights) CLI for localhost projects via [ngrok](https://ngrok.com).

## Install

```bash
npm i psi-local-cli -g
```

## Examples

```bash
psi-local --port 8080
# will test http://localhost:8080 via ngrok tunnel
```

```bash
psi-local --port 8080 --route /signup
# will test http://localhost:8080/signup via ngrok tunnel
```

```bash
psi-local --port 8080 --nopsi
# will just create tunnel for http://localhost:8080 without calling PSI
# you can manually copy-paste generated ngrok url to PSI web interface
```

All [psi-cli](https://github.com/addyosmani/psi) options are supported:

```bash
psi-local --port 8080 --strategy mobile
# will test http://localhost:8080 via ngrok tunnel and pass `strategy` to psi-cli
```

---

**MIT Licensed**
