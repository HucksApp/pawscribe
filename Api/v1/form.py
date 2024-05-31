from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, TextAreaField, SelectField
from wtforms.validators import DataRequired, Email, EqualTo, ValidationError
from db.models.user import User


class ShareTextForm(FlaskForm):
    content = TextAreaField('Content', validators=[DataRequired()])
    file_type = SelectField('File Type', choices=[('py', '.py'), ('txt', '.txt'), ('c', '.c'), ('js', '.js'), ('html', '.html'), ('css', '.css')], validators=[DataRequired()])
    share_option = SelectField('Share Option', choices=[('public', 'Public'), ('private', 'Private')], validators=[DataRequired()])
    sharing_key = StringField('Sharing Key')
    submit = SubmitField('Share')

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = StringField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')


class SignupForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    confirm_password = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

    def validate_username(self, username):
        user = User.query.filter_by(username=username.data).first()
        if user:
            raise ValidationError('Username is already taken.')

    def validate_email(self, email):
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('Email is already registered.')