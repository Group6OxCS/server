from django import template
import pathlib


DOCS_DIR = pathlib.Path(__file__).parent.parent / "docs"

register = template.Library()


@register.filter
def load_docs(value):
    return (DOCS_DIR / value).read_text()


@register.filter
def round2dp(value):
    try:
        return round(value, 2)
    except:
        return value


@register.filter
def mapround(value):
    if isinstance(value, dict):
        return {k:round2dp(v) for k, v in value.items()}
    elif isinstance(value, list):
        return list(map(round2dp, value))
    return value
