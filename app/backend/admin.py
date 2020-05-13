from django.contrib import admin
from .models import Community, User, CommunityUserRole, CustomSection, Activity

admin.site.register(Community)
admin.site.register(User)
admin.site.register(CommunityUserRole)
admin.site.register(CustomSection)
admin.site.register(Activity)

