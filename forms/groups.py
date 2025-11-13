from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, FieldList, SubmitField,SelectField
from wtforms.validators import DataRequired, Length, Email, ValidationError,Optional
from services.db import supabase

class CreateGroupForm(FlaskForm):
    group_name = StringField(
        'Group Name',
        validators=[
            DataRequired(message="Group name is required"),
            Length(min=3, max=50, message="Group name must be between 3 to 50 characters")
        ]
    )

    description = TextAreaField(
        'Description (optional)',
        validators=[Length(max=200, message="Description cannot exceed 200 characters")],
        render_kw={"rows": 3}
    )

    members = FieldList(
        StringField('Member Email', validators=[Email(message="Enter a valid email")]),
        min_entries=1
    )

    submit = SubmitField('Create Group')

class EditGroupForm(FlaskForm):
    # Group info
    group_name = StringField("Group Name", validators=[DataRequired()])
    description = TextAreaField("Description", validators=[Optional()])

    # Add member
    email = StringField("Add Member by Email", validators=[Optional(), Email()])

    # Remove member
    member_to_remove = SelectField("Select Member to Remove", coerce=str, validators=[Optional()])

    
    submit = SubmitField("Save All Changes")



class DeleteGroupForm(FlaskForm):
    submit = SubmitField("Delete Group")



    # Custom validation to check if emails exist in users table
    def validate_members(self, field):
        emails = field.data
        valid_emails = []

        for email in emails:
            if email.strip():  # Skip empty entries
                result = supabase.table('users').select('id').eq('email', email.lower()).execute()
                if not result.data:
                    raise ValidationError(f"User with email '{email}' does not exist.")
                valid_emails.append(email.lower())

        if not valid_emails:
            raise ValidationError("At least one valid member email is required.")
