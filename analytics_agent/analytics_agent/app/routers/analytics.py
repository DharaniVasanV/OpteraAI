"""
analytics_agent/app/routers/analytics.py - Extended with real PostgreSQL data sync
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta
from typing import Optional

from analytics_agent.app.database import get_db
from analytics_agent.app.schemas import AnalyticsDashboardMetrics
from analytics_agent.app.analytics_engine import get_dashboard_analytics

import psycopg2

router = APIRouter(prefix="/api/analytics", tags=["Analytics Engine & Metrics"])


# ── Shared PostgreSQL connection helper ──────────────────────────
def _pg_conn():
    return psycopg2.connect(
        dbname="meeting_agent_new",
        user="postgres",
        password="vasan5707",
        host="localhost",
        port=5432,
        connect_timeout=5,
    )


# ── Aggregate real metrics directly from PostgreSQL ──────────────
def _live_summary(period: str = "week", user_id: str = None) -> dict:
    """Pull live counts from the main AgentOS PostgreSQL database."""
    today = date.today()
    if period == "today":
        since = datetime.combine(today, datetime.min.time())
    elif period == "month":
        since = datetime.combine(today - timedelta(days=29), datetime.min.time())
    elif period == "total":
        since = datetime(2000, 1, 1)
    else:  # week
        since = datetime.combine(today - timedelta(days=6), datetime.min.time())

    summary = {
        "meetings": 0, "emails": 0, "career_analyses": 0,
        "learning_plans": 0, "notifications": 0,
        "meeting_minutes": 0,
        "tasks_completed": 0, "tasks_overdue": 0, "tasks_total": 0
    }
    try:
        conn = _pg_conn()
        cur = conn.cursor()

        # Meetings
        if user_id:
            cur.execute("SELECT COUNT(*) FROM watcher_items WHERE created_at >= %s AND user_email = %s AND category ILIKE '%%meeting%%'", (since, user_id))
        else:
            cur.execute("SELECT COUNT(*) FROM watcher_items WHERE created_at >= %s AND category ILIKE '%%meeting%%'", (since,))
        row = cur.fetchone(); summary["meetings"] = row[0] if row else 0

        # Emails Processing
        if user_id:
            cur.execute("SELECT COUNT(*) FROM watcher_items WHERE created_at >= %s AND user_email = %s AND category NOT ILIKE '%%meeting%%'", (since, user_id))
        else:
            cur.execute("SELECT COUNT(*) FROM watcher_items WHERE created_at >= %s AND category NOT ILIKE '%%meeting%%'", (since,))
        row = cur.fetchone(); summary["emails"] = row[0] if row else 0

        # Career analyses
        if user_id:
            cur.execute("SELECT COUNT(*) FROM career_analyses WHERE created_at >= %s AND user_id = %s", (since, user_id))
        else:
            cur.execute("SELECT COUNT(*) FROM career_analyses WHERE created_at >= %s", (since,))
        row = cur.fetchone(); summary["career_analyses"] = row[0] if row else 0

        # Learning plans
        if user_id:
            cur.execute("SELECT COUNT(*) FROM learning_plans WHERE created_at >= %s AND user_id = %s", (since, user_id))
        else:
            cur.execute("SELECT COUNT(*) FROM learning_plans WHERE created_at >= %s", (since,))
        row = cur.fetchone(); summary["learning_plans"] = row[0] if row else 0

        # Approx meeting minutes
        try:
            if user_id:
                cur.execute("SELECT COALESCE(SUM(duration_minutes),0) FROM watcher_items WHERE created_at >= %s AND user_email = %s", (since, user_id))
            else:
                cur.execute("SELECT COALESCE(SUM(duration_minutes),0) FROM watcher_items WHERE created_at >= %s", (since,))
            row = cur.fetchone(); summary["meeting_minutes"] = int(row[0]) if row else 0
        except Exception:
            conn.rollback()

        conn.close()
    except Exception as e:
        print(f"[Analytics] PostgreSQL read error: {e}")

    return summary


@router.get("/dashboard", response_model=AnalyticsDashboardMetrics)
def get_analytics_dashboard_data(
    user_id: str = Query("user_1", description="Isolated User ID"),
    filter_period: str = Query("week", description="Time period filter: today, week, month, custom"),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    result = get_dashboard_analytics(
        db=db,
        user_id=user_id,
        filter_period=filter_period,
        custom_start=start_date,
        custom_end=end_date
    )

    live = _live_summary(filter_period, user_id)
    result.meeting.total_meetings = live["meetings"]
    result.meeting.total_duration_minutes = live["meeting_minutes"]
    result.email.total_processed = live["emails"]
    result.career.career_activity_count = live["career_analyses"]
    result.career.applications_submitted = live["career_analyses"]
    result.task.completed = live["tasks_completed"]
    result.task.overdue = live["tasks_overdue"]
    result.task.total = live["tasks_total"]

    calc_score = 0
    if live["meetings"] > 0: calc_score += min(20, live["meetings"] * 5)
    if live["emails"] > 0: calc_score += min(30, live["emails"] * 2)
    if live["career_analyses"] > 0: calc_score += 25
    if live["learning_plans"] > 0: calc_score += 25

    result.productivity_score = max(result.productivity_score, min(100.0, float(calc_score)))

    if any(v > 0 for v in live.values()):
        result.has_data = True

    return result


@router.get("/summary")
def get_live_summary(period: str = Query("week"), user_id: str = None):
    """Quick live summary pulling directly from the main PostgreSQL database."""
    return _live_summary(period, user_id)


@router.get("/activity-trend")
def get_activity_trend(
    user_id: str = Query("user_1"),
    period: str = Query("week", description="week or month")
):
    """
    Returns daily activity counts for the Productivity Activity Line Chart.
    Queries watcher_items and career_analyses per day for each user.
    """
    today = date.today()
    days = 7 if period == "week" else 30
    since = today - timedelta(days=days - 1)

    date_range = [(since + timedelta(days=i)) for i in range(days)]
    result = {
        str(d): {"date": str(d), "Emails": 0, "Applications": 0, "Meetings": 0, "Tasks": 0}
        for d in date_range
    }

    try:
        conn = _pg_conn()
        cur = conn.cursor()

        # Emails per day
        try:
            cur.execute("""
                SELECT DATE(created_at) as day, COUNT(*)
                FROM watcher_items
                WHERE created_at >= %s AND user_email = %s AND category NOT ILIKE '%%meeting%%'
                GROUP BY day ORDER BY day
            """, (datetime.combine(since, datetime.min.time()), user_id))
            for row in cur.fetchall():
                key = str(row[0])
                if key in result:
                    result[key]["Emails"] = row[1]
        except Exception:
            conn.rollback()

        # Meetings per day
        try:
            cur.execute("""
                SELECT DATE(created_at) as day, COUNT(*)
                FROM watcher_items
                WHERE created_at >= %s AND user_email = %s AND category ILIKE '%%meeting%%'
                GROUP BY day ORDER BY day
            """, (datetime.combine(since, datetime.min.time()), user_id))
            for row in cur.fetchall():
                key = str(row[0])
                if key in result:
                    result[key]["Meetings"] = row[1]
        except Exception:
            conn.rollback()

        # Applications (career_analyses) per day
        try:
            cur.execute("""
                SELECT DATE(created_at) as day, COUNT(*)
                FROM career_analyses
                WHERE created_at >= %s AND user_id = %s
                GROUP BY day ORDER BY day
            """, (datetime.combine(since, datetime.min.time()), user_id))
            for row in cur.fetchall():
                key = str(row[0])
                if key in result:
                    result[key]["Applications"] = row[1]
        except Exception:
            conn.rollback()

        conn.close()
    except Exception as e:
        print(f"[ActivityTrend] DB error: {e}")

    return sorted(result.values(), key=lambda x: x["date"])


@router.get("/agent-usage")
def get_agent_usage(
    user_id: str = Query("user_1"),
    period: str = Query("week")
):
    """
    Returns per-agent task counts for the Agent Usage & Performance Bar Chart.
    Pulls from multiple PostgreSQL tables representing each agent's output.
    """
    today = date.today()
    days = 7 if period == "week" else 30
    since = datetime.combine(today - timedelta(days=days - 1), datetime.min.time())

    agents = {
        "Watcher": 0,
        "Research": 0,
        "Knowledge": 0,
        "Resume": 0,
        "Application": 0,
        "Meeting": 0,
        "Calendar": 0,
        "Notification": 0,
    }

    try:
        conn = _pg_conn()
        cur = conn.cursor()

        # Watcher — all watcher_items emails
        try:
            cur.execute("SELECT COUNT(*) FROM watcher_items WHERE created_at >= %s AND user_email = %s", (since, user_id))
            row = cur.fetchone(); agents["Watcher"] = row[0] if row else 0
        except Exception:
            conn.rollback()

        # Meeting Agent — watcher_items tagged as meetings
        try:
            cur.execute("SELECT COUNT(*) FROM watcher_items WHERE created_at >= %s AND user_email = %s AND category ILIKE '%%meeting%%'", (since, user_id))
            row = cur.fetchone(); agents["Meeting"] = row[0] if row else 0
        except Exception:
            conn.rollback()

        # Resume Agent — resumes table
        try:
            cur.execute("SELECT COUNT(*) FROM resumes WHERE created_at >= %s AND user_email = %s", (since, user_id))
            row = cur.fetchone(); agents["Resume"] = row[0] if row else 0
        except Exception:
            conn.rollback()

        # Application/Career Agent — career_analyses
        try:
            cur.execute("SELECT COUNT(*) FROM career_analyses WHERE created_at >= %s AND user_id = %s", (since, user_id))
            row = cur.fetchone(); agents["Application"] = row[0] if row else 0
        except Exception:
            conn.rollback()

        # Knowledge Agent — learning_plans
        try:
            cur.execute("SELECT COUNT(*) FROM learning_plans WHERE created_at >= %s AND user_id = %s", (since, user_id))
            row = cur.fetchone(); agents["Knowledge"] = row[0] if row else 0
        except Exception:
            conn.rollback()

        # Calendar Agent — calendar_events
        try:
            cur.execute("SELECT COUNT(*) FROM calendar_events WHERE created_at >= %s AND user_id = %s", (since, user_id))
            row = cur.fetchone(); agents["Calendar"] = row[0] if row else 0
        except Exception:
            conn.rollback()

        # Notification Agent — notification_jobs
        try:
            cur.execute("SELECT COUNT(*) FROM notification_jobs WHERE created_at >= %s AND user_id = %s", (since, user_id))
            row = cur.fetchone(); agents["Notification"] = row[0] if row else 0
        except Exception:
            conn.rollback()

        conn.close()
    except Exception as e:
        print(f"[AgentUsage] DB error: {e}")

    return [{"agent": k, "tasks": v} for k, v in agents.items()]
