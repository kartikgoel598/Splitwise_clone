from flask_wtf import FlaskForm
from wtforms import StringField, FieldList, SubmitField,RadioField,DecimalField,SelectField
from wtforms.validators import DataRequired,Length,NumberRange

class AddExpenseForm(FlaskForm):
    description = StringField(
        'description',
        validators = [DataRequired(),Length(min=1,max=100)]
    )
    amount = DecimalField('amount',validators=[DataRequired(),NumberRange(min=0.01)],places=2)
    paid_by = SelectField('paid_by',coerce=int,validators=[DataRequired()])
    split_type = RadioField(
        'split_type',
        choices=[('equal','Equal'),('unequal','Unequal')],
        default='equal',
        validators=[DataRequired()]
    )
    submit = SubmitField('Add Expense')
