import tomllib
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
    scope: str = "essential"
    description: Optional[str] = None


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
        cookie = Cookie(name=cookie_data.get("name"), type=cookie_data.get("type"), scope=cookie_data.get("scope"))
        for lang in general.languages:
            lang_data = cookie_data.get(lang)
            if lang_data:
                description = lang_data.get("description")
                if description:
                    setattr(cookie, f"{lang}_description", description)
        cookies.append(cookie)

    return Config(general=general, cookies=cookies)
