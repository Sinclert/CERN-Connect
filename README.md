# CERN-Connect

## API specification
In order to comunicate front-end and back-end, we will have 3 endpoints:

### /upload

##### send:
```json
{
    "location": [345.3563464, 234.2452345],
    "name": "Varsha",
    "events": [345634563456, 3456345667567, 857845785687]
}
```

##### receive:
- Null

### /fetch

##### send:
```json
{
    "events": [345634563456, 3456345667567, 857845785687]
}
```

##### Return:
```json
[
    {
        "name": "BBQ",
        "location": [345.3563464, 234.2452345],
        "members": [
            {
                "name": "Varsha",
                "location": [45.234, 24.7567]
             },
             {}
        ]
    },
    {}
]
```


### /events

##### send:
Null

##### Return:
```json
[
    {
        "id": 3453563464,
        "name": "BBQ",
    },
    {}
]
```
