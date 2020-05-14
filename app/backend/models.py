from django.db import models
from django.contrib.auth.models import User
from django_countries.fields import CountryField
from django.contrib.auth.models import ( AbstractBaseUser, BaseUserManager, PermissionsMixin )
from phone_field import PhoneField
from django.conf import settings
import json

class CustomSection(models.Model):
    # Choices for type
    GALLERY = 'GALLERY'
    RESOURCES = 'RESOURCES'
    DISCUSSIONS = 'DP'
    GENERAL = 'GENERAL'
    BUTTON = 'BUTTON'
    TYPE_CHOICES = [
        (GALLERY, 'Gallery'),
        (RESOURCES, 'Resources'),
        (DISCUSSIONS, 'Discussions and Pages'),
        (GENERAL, 'General'),
        (BUTTON, 'Button'),
    ]

    name = models.CharField(max_length=128, blank=False)
    type = models.CharField(max_length=128, choices=TYPE_CHOICES, blank=False, default=GENERAL)
    # For gallery, pages, general, and resources pages only
    link = models.URLField(blank=True)
    # For resources and general types only
    title = models.CharField(max_length=64, blank=True)
    description = models.CharField(max_length=128, blank=True)

    def __str__(self):
        return self.name


class Community(models.Model):
    # defaults were just for already existing rows, no real meaning
    name = models.CharField(max_length=128, default='')
    is_closed = models.CharField(default='false', max_length=5)
    description = models.CharField(max_length=256, default='')
    zipcode = models.CharField(max_length=10, default='')
    country = models.CharField(max_length=128, default='US')

    def __str__(self):
        return self.name


class UserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, phone_number_1, address_line_1='', address_line_2='', 
                    city='', state='', zipcode='', country='US', phone_number_1_type='mobile', phone_number_2='',
                    phone_number_2_type='', who_help='', how_learn='', how_help='', how_know='', skills_to_offer='', password=None, commit=True):

        if not first_name:
            raise ValueError(_('Users must have a first name'))
        if not last_name:
            raise ValueError(_('Users must have a last name'))
        if not phone_number_1:
            raise ValueError(_('Users must have a phone number'))
        if not email:
            raise ValueError(_('Users must have an email address'))

        user = self.model(
                first_name=first_name,
                last_name=last_name,
                email=self.normalize_email(email),
                address_line_1=address_line_1,
                address_line_2=address_line_2,
                city=city,
                state=state,
                zipcode=zipcode,
                country=country,
                phone_number_1=phone_number_1,
                phone_number_2=phone_number_2,
                phone_number_1_type=phone_number_1_type,
                phone_number_2_type=phone_number_2_type,
                how_learn=how_learn,
                who_help=who_help,
                how_help=how_help,
                how_know=how_know,
                skills_to_offer=skills_to_offer
        )
        user.set_password(password)
        if commit:
            user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, phone_number_1, password=None, commit=True):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone_number_1=phone_number_1,
            commit=False,
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):

    FAMILY = 'Family'
    FRIEND = 'Friend'
    FRIEND_OF_FRIEND = 'Friend of a friend'
    COWORKER = 'Coworker'
    ATTEND_SAME_SCHOOL = 'Attend the same school'
    NEIGHBOR = 'Neighbor'
    SOCIAL_MEDIA = 'Social Media'
    WORSHIP_TOGETHER = 'Worship together'
    DONT_PERSONALLY = 'Do not personally know'

    HOW_KNOW_CHOICES = [
        (FAMILY, 'Family'),
        (FRIEND, 'Friend'),
        (FRIEND_OF_FRIEND, 'Friend of a friend'),
        (COWORKER, 'Coworker'),
        (ATTEND_SAME_SCHOOL, 'Attend the same school'),
        (NEIGHBOR, 'Neighbor'),
        (SOCIAL_MEDIA, 'Social Media'),
        (WORSHIP_TOGETHER, 'Worship together'),
        (DONT_PERSONALLY, 'Do not personally know')
    ]

    INDIVIDUAL = 'As an individual volunteer'
    HOUSE_OF_WORSHIP = 'Through my house of worship'
    ORGANIZATION = 'Through a volunteer organization that I am a member of'

    HOW_HELP_CHOICES = [
        (INDIVIDUAL, 'As an individual volunteer'),
        (HOUSE_OF_WORSHIP, 'Through my house of worship'),
        (ORGANIZATION, 'Through a volunteer organization that I am a member of')
    ]

    NO_SELECTION = 'No Selection'
    CARED_HEALTH_CRISIS = 'Cared for someone with a life-threatening health crisis'
    HAD_HEALTH_CRISIS = 'I have had a life-threatening health crisis'
    HEALTHCARE_PROVIDER = 'Healthcare provider'
    TECH = 'Computer, technology, and social media'
    FINANCIAL = 'Accounting, financial services'
    CHILD_CARE = 'Provide licensed child care'
    LEGAL = 'Legal, attorney'
    COUNSELING = 'Counseling'
    HEALTH_INSURANCE = 'Skilled in complex health insurance issues'
    OTHER = 'Other'

    SKILLS_TO_OFFER = [
        (NO_SELECTION, 'No Selection'),
        (CARED_HEALTH_CRISIS, "Cared for someone with a life-threatening health crisis"),
        (HAD_HEALTH_CRISIS, "I have had a life-threatening health crisis"),
        (HEALTHCARE_PROVIDER, "Healthcare provider"),
        (TECH, "Computer, technology, and social media"),
        (FINANCIAL, "Accounting, financial services"),
        (CHILD_CARE, 'Provide licensed child care'),
        (LEGAL, "Legal, attorney"),
        (COUNSELING, "Counseling"),
        (HEALTH_INSURANCE, "Skilled in complex health insurance issues"),
        (OTHER, 'Other')
    ]

    first_name = models.CharField(max_length=30, blank=False)
    last_name = models.CharField(max_length=150, blank=False)
    email = models.EmailField(max_length=255, unique=True)
    address_line_1 = models.CharField(max_length=150, blank=True, default='')
    address_line_2 = models.CharField(max_length=150, blank=True, default='')
    city = models.CharField(max_length=30, blank=True, default='')
    state = models.CharField(max_length=30, blank=True, default='')
    zipcode = models.CharField(max_length=10, blank=True, default='')
    country = models.CharField(max_length=128, blank=True, default='US')
    phone_number_1 = models.CharField(max_length=30, blank=True, default='')
    phone_number_1_type = models.CharField(max_length=30, blank=True, default='')
    phone_number_2 = models.CharField(max_length=30, blank=True, default='')
    phone_number_2_type = models.CharField(max_length=30, blank=True, default='')
    how_learn = models.TextField(blank=True, default='')
    who_help = models.CharField(max_length=256, blank=True, default='')
    how_help = models.CharField(
        max_length=128,
        choices=HOW_HELP_CHOICES,
        default=INDIVIDUAL,
        blank=False,
    )
    how_know = models.CharField(
        max_length=128,
        choices=HOW_KNOW_CHOICES,
        default=FRIEND,
        blank=False,
    )
    skills_to_offer = models.CharField(
        max_length=128,
        choices=SKILLS_TO_OFFER,
        default=NO_SELECTION,
        blank=False,
    )
    # password field supplied by AbstractBaseUser
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number_1']

    def get_full_name(self):
        full_name = '%s %s' % (self.first_name, self.last_name)
        return full_name.strip()

    def __str__(self):
        return '{} <{}>'.format(self.get_full_name(), self.email)


class CommunityUserRole(models.Model):
    ADMIN = 'ADMIN'
    COMM_LEADER = 'COMM_LEADER'
    COORDINATOR = 'COORDINATOR'
    COMM_MEMBER = 'COMM_MEMBER'
    COMMUNITY_ROLE_CHOICES = [
        (ADMIN, 'Administrator'),
        (COMM_LEADER, 'Community Leader'),
        (COORDINATOR, 'Coordinator'),
        (COMM_MEMBER, 'Community Member'),
    ]

    community = models.ForeignKey(Community, on_delete=models.CASCADE, null=False, blank=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False, blank=False)
    role = models.CharField(
        max_length=11,
        choices=COMMUNITY_ROLE_CHOICES,
        default=COMM_MEMBER,
        blank=False,
    )


# for activity class
def compute_display_type(role, vn, vs):
    if not role == 'Event':
        return 'Event'
    elif vn > vs:
        return 'Help Needed'
    else:
        return 'Needs Met'


class Activity(models.Model):

    GIVING_RIDES = "Giving Rides"
    PREPARING_MEALS = "Preparing Meals"
    SHOPPING = "Shopping"
    CHILDCARE = "Childcare"
    VISITS = "Visits"
    COVERAGE = "Coverage"
    MISCELLANEOUS = "Miscellaneous"
    EVENT = "Event"

    ACTIVITY_TYPE_CHOICES = [
        (GIVING_RIDES, "Giving Rides"),
        (PREPARING_MEALS, "Preparing Meals"),
        (SHOPPING, "Shopping"),
        (CHILDCARE, "Childcare"),
        (VISITS, "Visits"),
        (COVERAGE, "Coverage"),
        (MISCELLANEOUS, "Miscellaneous"),
        (EVENT, "Event")
    ]

    NEVER = "Never"
    WEEKLY = "Weekly"
    CUSTOM = "Custom"

    REPEAT_CHOICES = [
        (NEVER, "Never"),
        (WEEKLY, "Weekly"),
        (CUSTOM, "Custom")
    ]

    NONE = "None"
    VEGETARIAN = "Vegetarian"
    KOSHER = "Kosher"
    NUT_FREE = "Nut-free"
    LACTOSE_FREE = "Lactose-free"
    WHEAT_FREE = "Wheat-free"
    GLUTEN_FREE = "Gluten-free"
    SOY_FREE = "Soy-free"
    SUGAR_FREE = "Sugar-free"
    LOW_FAT = "Low-fat"
    LOW_CARB = "Low-carb"
    LOW_SALT = "Low-salt"
    OTHER = "Other (see notes)"

    DIETARY_RESTRICT_CHOICES = [
        (NONE, "None"),
        (VEGETARIAN, "Vegetarian"),
        (KOSHER, "Kosher"),
        (NUT_FREE, "Nut-free"),
        (LACTOSE_FREE, "Lactose-free"),
        (WHEAT_FREE, "Wheat-free"),
        (GLUTEN_FREE, "Gluten-free"),
        (SOY_FREE, "Soy-free"),
        (SUGAR_FREE, "Sugar-free"),
        (LOW_FAT, "Low-fat"),
        (LOW_CARB, "Low-carb"),
        (LOW_SALT, "Low-salt"),
        (OTHER, "Other (see notes)")
    ]

    community = models.ForeignKey(Community, on_delete=models.CASCADE, null=False, blank=False)
    role = models.CharField(
        max_length=20,
        choices=ACTIVITY_TYPE_CHOICES,
        default=EVENT,
        blank=False,
    )
    name = models.CharField(max_length=30, blank=False)
    notes = models.CharField(max_length=200, blank=False)
    # next two are year, month, date
    start_date = models.CharField(max_length=30, blank=False)
    end_date = models.CharField(max_length=30, blank=False)

    repeat = models.CharField(
        max_length=6,
        choices=REPEAT_CHOICES,
        default=NEVER,
        blank=False,
    )
    weekly_repeat_dates = models.CharField(max_length=150, blank=True, default='')
    custom_repeat_dates = models.CharField(max_length=150, blank=True, default='')

    # next four are not for event
    est_hours = models.CharField(max_length=10, blank=True, default='')
    est_minutes = models.CharField(max_length=20, blank=True, default='')
    volunteers_needed = models.CharField(max_length=20, blank=True, default='')
    volunteers_signed_up = models.CharField(max_length=20, blank=True, default='')

    # might be wonky w current char fields

    display_type = models.CharField(max_length=12, default=compute_display_type(role, volunteers_needed,
                                                                volunteers_signed_up), blank=True)

    # next 6 are giving rides fields
    pickup_time = models.CharField(max_length=150, blank=True, default='')
    pickup_location = models.CharField(max_length=150, blank=True, default='')
    pickup_between = models.CharField(max_length=150, blank=True, default='')
    arrive_time = models.CharField(max_length=150, blank=True, default='')
    pickup_location = models.CharField(max_length=150, blank=True, default='')
    destination = models.CharField(max_length=150, blank=True, default='')

    # next 3 are for preparing meals
    dietary_restrictions = models.CharField(max_length=500, choices=DIETARY_RESTRICT_CHOICES, blank=True, default='')

    def set_dietary_rest(self, x):
        self.dietary_restrictions = json.dumps(x)

    def get_dietary_rest(self):
        return json.loads(self.dietary_restrictions)

    delivery_between = models.CharField(max_length=150, blank=True, default='')
    delivery_location = models.CharField(max_length=150, blank=True, default='')

    # next 3 are for shopping, childcare, visit, coverage, misc, and event
    start_time = models.CharField(max_length=150, blank=True, default='')
    end_time = models.CharField(max_length=150, blank=True, default='')
    location = models.CharField(max_length=150, blank=True, default='')
