from django import template
import pathlib


DOCS_DIR = pathlib.Path(__file__).parent.parent / "docs"

register = template.Library()


@register.filter
def load_docs(value):
    return (DOCS_DIR / value).read_text()
