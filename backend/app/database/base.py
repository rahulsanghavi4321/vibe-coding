from app.database.connection import Base

# Import all models to register with Base.metadata
from app.models.user import User, Customer, ServiceProvider, Technician
from app.models.category import ServiceCategory, ServiceSubcategory, Service, ProviderService
from app.models.booking import Booking, BookingAssignment, BookingImage, BookingStatusHistory
from app.models.payment import Payment, Invoice, Coupon, ProviderEarning
from app.models.feedback import Review, Complaint, ComplaintHistory
from app.models.operational import (
    Address, 
    ServiceArea, 
    AvailabilitySlot, 
    Notification, 
    SubscriptionPlan, 
    ProviderSubscription, 
    AdminAnnouncement,
    Favourite
)

