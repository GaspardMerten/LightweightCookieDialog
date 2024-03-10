import re
import tomllib
import uuid
from dataclasses import dataclass
from typing import List, Optional


@dataclass
class General:
    languages: List[str]
    fallback: str
    translations: Optional[dict] = None


@dataclass
class Language:
    text: str
    accept: str
    decline: str


@dataclass
class Cookie:
    name: str
    type: str
    is_ga: bool = False
    type_text: Optional[str] = None
    scope: str = "essential"
    description: Optional[str] = None

    def __post_init__(self):
        self.uuid = hash(self.name).__abs__().__str__()[0:4]
        # Sanitize the name to be used as a public ID
        self.public_id = re.sub(r"[^a-zA-Z0-9]", "_", self.name).lower()


@dataclass
class Config:
    general: General
    cookies: List[Cookie]


def parse_config(filename):
    with open(filename, "rb") as f:
        config_data = tomllib.load(f)

    general_data = config_data.get("general")

    general = General(languages=general_data["languages"], fallback=general_data["fallback"])
    general.translations = {}

    for lang in general.languages:
        general.translations[lang] = general_data.get(lang)

    cookies = []
    for cookie_name, cookie_data in config_data.get("cookies", {}).items():
        cookie = Cookie(name=cookie_data.get("name"), type=cookie_data.get("type"), scope=cookie_data.get("scope"),is_ga=cookie_data.get("is_ga"))
        description = {}
        type_text = {}

        for lang in general.languages:
            lang_data = cookie_data.get(lang)
            if lang_data:
                description[lang] = lang_data.get("description")
                type_text[lang] = lang_data.get("type")

        cookie.description = description
        cookie.type_text = type_text
        cookies.append(cookie)

    return Config(general=general, cookies=cookies)
