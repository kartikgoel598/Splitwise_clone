from flask_wtf import FlaskForm
from wtforms import DecimalField,SelectField,SubmitField
from wtforms.validators import DataRequired,NumberRange

class SettlementForm(FlaskForm):
    pay_to = SelectField('pay_to', coerce=str,validators=[DataRequired()])
    amount = DecimalField('amount',validators=[DataRequired(),NumberRange(min=0.01)],places=2)
    submit = SubmitField('Settle Up')

