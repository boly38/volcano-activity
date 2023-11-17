# volcano-activity API (BETA)

> [!WARNING]  
> Work in progress

This page describe ReST API of the [volcano-activity](./README.md) project.

> [!NOTE]  
> ALL API versions under `v1` are in BETA and some breaking changes may be introduced.

## v0 API (BETA)

### ABOUT

[GET /about](https://volcano.cyclic.app/about) 

- Retrieve application version, start date, and api version, volcanoes/lives counts.

Example:
````json
{
  "application": {
    "version": "0.0.1",
    "startDate": "2023-11-16T19:34:51.811Z"
  },
  "api": {
    "version": "v0",
    "volcanoesCount": 7,
    "livesCount": 8
  }
}
````

### v0 - GET volcanoes + lives

[GET /api/v0/volcanoes](https://volcano.cyclic.app/api/v0/volcanoes) 

- Retrieve list volcanoes + lives

Example:
````json
[
  {
    "id": "etna",
    "name": "Etna",
    "country": "Italy",
    "region": "Sicile",
    "file": "volcanoes.json",
    "lives": [
      {
        "volcano_id": "etna",
        "type": "youtube",
        "url": "https://www.youtube.com/watch?v=9x8gxQcw5ps",
        "name": "Mt Etna! fullscreen",
        "location": "Mt Etna",
        "owner": "afar TV",
        "ownerURl": "https://www.youtube.com/@afartv",
        "state": "active",
        "lastState": "2023-11-14",
        "lastActive": "",
        "lastUpdate": "2023-11-14",
        "file": "lives_etna.json"
      }
    ]
  }
]
````

### v0 - GET volcanoes ONLY
[GET /api/v0/volcanoes?without-lives=true](https://volcano.cyclic.app/api/v0/volcanoes?without-lives=true)

- Retrieve list volcanoes ONLY

Example:
````json
[
  {
    "id": "etna",
    "name": "Etna",
    "country": "Italy",
    "region": "Sicile",
    "file": "volcanoes.json"
  },
  {
    "id": "fagradalsfjall",
    "name": "Fagradalsfjall",
    "country": "Iceland",
    "region": "Suðurnes",
    "file": "volcanoes.json"
  }
]
````