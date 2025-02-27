# urls.py
from django.urls import path
from django.contrib.auth import views as auth_views
from .views import save_memo, get_memos, delete_memo, MemoListView, MemoDeleteView

app_name = 'nenkanapp'

urlpatterns = [
    path('karenda/', auth_views.LoginView.as_view(template_name='index.html'), name='karenda'),
    path("memos/", MemoListView.as_view(), name="memo_list"),
    path("save_memo/", save_memo, name="save_memo"),
    path("get_memos/", get_memos, name="get_memos"),
    path("memos/delete/<int:pk>/", MemoDeleteView.as_view(), name="memo_delete"),
]
