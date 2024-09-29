from pydantic import BaseModel, validator, root_validator
from typing import Optional
from datetime import datetime

class UserActionModel(BaseModel):
    username: str
    dateS: Optional[str]
    dateE: Optional[str]
    good: Optional[int]
    start: Optional[str]
    end: Optional[str]
    message: Optional[str]

    @root_validator(pre=True)
    def check_dates_and_ranges(cls, values):
        dateS = values.get('dateS')
        dateE = values.get('dateE')
        start = values.get('start')
        end = values.get('end')
        if (dateS != "1000-01-01" or dateE != "9000-01-01") and (start != "1000-01-01" or end != "9000-01-01"):
            raise ValueError("dateS/dateE and start/end cannot be used together")
        if start and end:
            try:
                datetime.strptime(start, '%Y-%m-%d')
                datetime.strptime(end, '%Y-%m-%d')
            except ValueError:
                raise ValueError("start and end must be in the format YYYY-MM-DD")
        if dateS:
            try:
                datetime.strptime(dateS, '%Y-%m-%d')
            except ValueError:
                raise ValueError("dateS must be in the format YYYY-MM-DD")
        if dateE:
            try:
                datetime.strptime(dateE, '%Y-%m-%d')
            except ValueError:
                raise ValueError("dateE must be in the format YYYY-MM-DD")
        return values
