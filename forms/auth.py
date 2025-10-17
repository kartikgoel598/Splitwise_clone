from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, validators
from wtforms.validators import DataRequired, Email, Length, EqualTo
from services.db import supabase

class SignInForm(FlaskForm):
    email = StringField('email',validators = [DataRequired(),Email(message='enter a valid email'),])

    password = PasswordField('password',validators=[DataRequired(),Length(min=6,max=20,message='password must be between 6 to 20 characters')])

    submit = SubmitField('sign In')

class SignUpForm(FlaskForm):
    username = StringField('username', validators=[DataRequired(),Length(min =3,max=50,message='username must be between 3 to 50 characters')])

    email=StringField('email',validators=[DataRequired(),Email(message='enter a valid email')])

    confirm_email= StringField('confirm_email',validators=[DataRequired(),Email(message='enter a valid email'),EqualTo('email',message = 'emails must match')])

    password= PasswordField('password',validators=[DataRequired(),Length(min=6,max=20,message='password must be between 6 to 20 characters')])

    confirm_password= PasswordField('confirm_password',validators=[DataRequired(),Length(min=6,max=20,message='password must be between 6 to 20 characters'),EqualTo('password',message='passwords must match')])

    submit= SubmitField('sign up')

    def validate_email(self,field):
        email = field.data.strip().lower()
        existing = supabase.table('users').select('id').eq('email',email).limit(1).execute()
        if existing.data:
            raise validators.ValidationError('email already registered')

    