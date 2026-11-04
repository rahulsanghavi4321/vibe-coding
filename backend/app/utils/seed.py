import logging
import datetime
from sqlalchemy.orm import Session
from app.database.connection import engine, SessionLocal, Base
from app.database.base import * # ensures all models are imported
from app.core.security import get_password_hash

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed")

def seed_database():
    logger.info("Initializing database schema across all 27 tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema verified.")

    db: Session = SessionLocal()
    try:
        # Check if already seeded
        admin_user = db.query(User).filter(User.email == "admin@homeservetech.com").first()
        if admin_user:
            logger.info("Database is already seeded with baseline records.")
            return

        logger.info("Seeding baseline users (Admin, Customer, Provider, Technician)...")
        pwd_hash = get_password_hash("Password@123")

        # 1. Super Admin
        admin = User(
            email="admin@homeservetech.com",
            password_hash=pwd_hash,
            full_name="Chief Administrator",
            phone="+91 99000 00001",
            role="super_admin",
            status="active"
        )
        db.add(admin)

        # 2. Demo Customer
        cust_user = User(
            email="customer@gmail.com",
            password_hash=pwd_hash,
            full_name="Rahul Sharma",
            phone="+91 98765 43210",
            role="customer",
            status="active"
        )
        db.add(cust_user)
        db.flush()

        cust_profile = Customer(
            user_id=cust_user.id,
            emergency_contact="+91 98765 00000"
        )
        db.add(cust_profile)
        db.flush()

        # Customer Address
        cust_address = Address(
            customer_id=cust_profile.id,
            title="Home",
            address_line1="Flat 402, Royal Palms Residency, 7th Main",
            address_line2="Near Wipro Circle",
            city="Bangalore",
            state="Karnataka",
            postal_code="560100",
            is_default=True
        )
        db.add(cust_address)

        # 3. Demo Service Provider
        prov_user = User(
            email="provider@apexservices.com",
            password_hash=pwd_hash,
            full_name="Rajesh Sharma (Apex Services)",
            phone="+91 98450 12345",
            role="service_provider",
            status="active"
        )
        db.add(prov_user)
        db.flush()

        prov_profile = ServiceProvider(
            user_id=prov_user.id,
            business_name="Apex Home & Electrical Solutions",
            business_registration_number="REG-2024-APEX-8812",
            tax_id="GSTIN29AABCS1429B1Z8",
            business_bio="Licensed electrical and HVAC contractor with 12+ years of residential service expertise.",
            verification_status="verified",
            commission_rate=15.0,
            rating_avg=4.9,
            rating_count=128,
            is_available=True
        )
        db.add(prov_profile)
        db.flush()

        # Provider Service Area & Availability
        area = ServiceArea(
            provider_id=prov_profile.id,
            city="Bangalore",
            postal_code="560100",
            radius_km=25.0
        )
        db.add(area)

        for d in range(6): # Mon-Sat
            slot = AvailabilitySlot(
                provider_id=prov_profile.id,
                day_of_week=d,
                start_time="09:00",
                end_time="19:00",
                slot_duration_minutes=60,
                is_active=True
            )
            db.add(slot)

        # 4. Demo Technician
        tech_user = User(
            email="technician@apexservices.com",
            password_hash=pwd_hash,
            full_name="Ramesh Kumar",
            phone="+91 98451 11223",
            role="technician",
            status="active"
        )
        db.add(tech_user)
        db.flush()

        tech_profile = Technician(
            user_id=tech_user.id,
            provider_id=prov_profile.id,
            specialization="Senior Electrician & Cooling Specialist",
            status="active",
            is_available=True
        )
        db.add(tech_profile)

        # 5. Core 8 Categories & Subcategories & Services
        logger.info("Seeding all 8 dynamic service categories & subcategories...")
        
        catalog = [
            {
                "name": "Electrical Services",
                "slug": "electrical-services",
                "desc": "Certified repairs for ceiling fans, wiring, switchboards, MCBs & lighting.",
                "icon": "zap",
                "subs": [
                    {"name": "Fan Installation & Repair", "slug": "fan-services", "services": [
                        {"title": "Ceiling Fan Installation & Repair", "slug": "ceiling-fan-install", "price": 299.0, "duration": 45, "desc": "Blade balancing, regulator check, capacitor replacement and secure ceiling hook mounting."},
                        {"title": "Exhaust Fan Installation", "slug": "exhaust-fan-install", "price": 249.0, "duration": 30, "desc": "Kitchen and bathroom exhaust fan wiring and wall mounting."}
                    ]},
                    {"name": "Switchboard & Wiring", "slug": "switchboard-wiring", "services": [
                        {"title": "Switchboard Repair & Socket Replacement", "slug": "switchboard-repair", "price": 199.0, "duration": 30, "desc": "Fix burnt sockets, sparkling switches, and modular switchboard replacements."},
                        {"title": "Full House Wiring Inspection & MCB Tripping Fix", "slug": "mcb-tripping-fix", "price": 499.0, "duration": 60, "desc": "Diagnosis of short circuits, load distribution, and MCB replacement."}
                    ]}
                ]
            },
            {
                "name": "Plumbing Services",
                "slug": "plumbing-services",
                "desc": "Expert plumbers for tap leaks, bathroom fixtures, piping & overhead tank cleaning.",
                "icon": "droplets",
                "subs": [
                    {"name": "Tap & Leakage Repair", "slug": "tap-leakage", "services": [
                        {"title": "Tap Repair & Flush Valve Replacement", "slug": "tap-repair-leakage", "price": 249.0, "duration": 30, "desc": "Fix dripping taps, mixer cartridges, and flush cistern leaks."},
                        {"title": "Under-Sink Pipe Leakage Sealing", "slug": "pipe-leakage-sealing", "price": 349.0, "duration": 45, "desc": "Seal waste coupling, trap replacement, and high-pressure joints."}
                    ]},
                    {"name": "Drainage & Tank Cleaning", "slug": "drain-tank-cleaning", "services": [
                        {"title": "High-Pressure Drain Unclogging", "slug": "drain-unclogging", "price": 399.0, "duration": 45, "desc": "Mechanical rotary snaking to unclog bathroom and kitchen floor traps."},
                        {"title": "Overhead Water Tank Sanitization (Up to 1000L)", "slug": "water-tank-cleaning", "price": 899.0, "duration": 90, "desc": "Deep sludge removal, UV antibacterial treatment, and wall scrubbing."}
                    ]}
                ]
            },
            {
                "name": "AC Repair & Maintenance",
                "slug": "ac-repair-maintenance",
                "desc": "Jet pump deep servicing, gas charging, PCB repair & installation.",
                "icon": "wind",
                "subs": [
                    {"name": "Servicing & Cleaning", "slug": "ac-servicing", "services": [
                        {"title": "AC Jet Deep Servicing & Filter Wash", "slug": "ac-jet-servicing", "price": 699.0, "duration": 60, "desc": "Power jet pressure cleaning of indoor cooling coils and outdoor heat exchangers."},
                        {"title": "AC Anti-Rust Foam Treatment", "slug": "ac-anti-rust-treatment", "price": 499.0, "duration": 45, "desc": "Protective coating to prevent coil corrosion in coastal and polluted environments."}
                    ]},
                    {"name": "Gas Refill & Repair", "slug": "ac-gas-repair", "services": [
                        {"title": "AC Gas Refill & Leak Detection", "slug": "ac-gas-refill", "price": 1899.0, "duration": 90, "desc": "Nitrogen pressure leak detection followed by genuine R32 / R410A refrigerant charge."},
                        {"title": "AC Compressor & Capacitor Replacement", "slug": "ac-compressor-repair", "price": 1299.0, "duration": 75, "desc": "Diagnostics for non-cooling units, replacement of start/run capacitor."}
                    ]}
                ]
            },
            {
                "name": "Home Cleaning",
                "slug": "home-cleaning",
                "desc": "Deep sanitization for full homes, kitchens, bathrooms, sofas & carpets.",
                "icon": "sparkles",
                "subs": [
                    {"name": "Deep Sanitization", "slug": "deep-sanitization", "services": [
                        {"title": "Full 2BHK Home Deep Sanitization", "slug": "full-home-cleaning", "price": 2499.0, "duration": 240, "desc": "Single-disc floor scrubbing, kitchen chimney degreasing, bathroom descaling & cobweb removal."},
                        {"title": "Complete Bathroom Deep Descaling", "slug": "bathroom-cleaning", "price": 499.0, "duration": 60, "desc": "Tile hard water stain removal, toilet descaling, mirror buffing and disinfectant mop."}
                    ]},
                    {"name": "Upholstery & Carpet", "slug": "upholstery-cleaning", "services": [
                        {"title": "Sofa Shampooing & Vacuum (5-Seater)", "slug": "sofa-shampooing", "price": 899.0, "duration": 90, "desc": "High-suction extraction shampooing to remove allergens, dirt and pet dander."}
                    ]}
                ]
            },
            {
                "name": "Painting Services",
                "slug": "painting-services",
                "desc": "Interior, exterior, texture design & waterproofing solutions.",
                "icon": "paintbrush",
                "subs": [
                    {"name": "Interior Painting", "slug": "interior-painting", "services": [
                        {"title": "Single Room Wall Painting & Touch-up", "slug": "room-wall-painting", "price": 1999.0, "duration": 180, "desc": "Two coats of premium acrylic emulsion with putty and primer surface prep."},
                        {"title": "Waterproofing Wall Seepage Treatment", "slug": "waterproofing-treatment", "price": 1499.0, "duration": 120, "desc": "Damp-proof elastomeric polymer barrier coating."}
                    ]}
                ]
            },
            {
                "name": "Carpentry Services",
                "slug": "carpentry-services",
                "desc": "Door repairs, wardrobe hinge adjustments, bed assembly & modular cabinetry.",
                "icon": "hammer",
                "subs": [
                    {"name": "Furniture & Door Repair", "slug": "furniture-door-repair", "services": [
                        {"title": "Door Lock & Mortise Handle Installation", "slug": "door-lock-installation", "price": 349.0, "duration": 45, "desc": "Precision wooden door mortising and cylinder installation."},
                        {"title": "Hydraulic Bed & Modular Cabinet Fitting", "slug": "bed-cabinet-fitting", "price": 599.0, "duration": 90, "desc": "Cabinet hinge realignments and pneumatic gas lift replacement."}
                    ]}
                ]
            },
            {
                "name": "Appliance Repair",
                "slug": "appliance-repair",
                "desc": "Washing machine, refrigerator, microwave & television repairs.",
                "icon": "tv",
                "subs": [
                    {"name": "Major Home Appliances", "slug": "major-appliances", "services": [
                        {"title": "Washing Machine Motor & Drain Pump Repair", "slug": "washing-machine-repair", "price": 499.0, "duration": 60, "desc": "Diagnosis of spin issues, error codes, drum belt and water drain pump."},
                        {"title": "Refrigerator Cooling & Thermostat Repair", "slug": "refrigerator-repair", "price": 449.0, "duration": 60, "desc": "Defrost heater testing, thermostat replacement and gas circulation check."}
                    ]}
                ]
            },
            {
                "name": "Pest Control",
                "slug": "pest-control",
                "desc": "Cockroach gel baiting, termite drilling & bed bug eradication.",
                "icon": "bug",
                "subs": [
                    {"name": "Pest Eradication", "slug": "pest-eradication", "services": [
                        {"title": "Odorless Cockroach Gel & Spray Treatment", "slug": "cockroach-pest-control", "price": 799.0, "duration": 45, "desc": "Food-safe herbal gel baiting in kitchen cabinets with a 90-day guarantee."},
                        {"title": "Anti-Termite Sub-Surface Chemical Drilling", "slug": "termite-pest-control", "price": 1999.0, "duration": 180, "desc": "Drill-fill-seal barrier around door frames and skirting boards."}
                    ]}
                ]
            }
        ]

        created_services = []
        for cat_data in catalog:
            cat = ServiceCategory(
                name=cat_data["name"],
                slug=cat_data["slug"],
                description=cat_data["desc"],
                icon=cat_data["icon"],
                is_active=True
            )
            db.add(cat)
            db.flush()

            for sub_data in cat_data["subs"]:
                sub = ServiceSubcategory(
                    category_id=cat.id,
                    name=sub_data["name"],
                    slug=sub_data["slug"],
                    is_active=True
                )
                db.add(sub)
                db.flush()

                for srv_data in sub_data["services"]:
                    srv = Service(
                        subcategory_id=sub.id,
                        title=srv_data["title"],
                        slug=srv_data["slug"],
                        base_price=srv_data["price"],
                        duration_minutes=srv_data["duration"],
                        description=srv_data["desc"],
                        is_active=True
                    )
                    db.add(srv)
                    db.flush()
                    created_services.append(srv)

                    # Bind to demo provider
                    ps = ProviderService(
                        provider_id=prov_profile.id,
                        service_id=srv.id,
                        custom_price=srv.base_price,
                        is_enabled=True
                    )
                    db.add(ps)

        # 6. Seed Demo Promotional Coupons
        logger.info("Seeding promotional coupons...")
        coupon1 = Coupon(
            code="WELCOME100",
            description="Flat ₹100 discount on your first service appointment",
            discount_type="fixed",
            discount_value=100.0,
            min_order_amount=299.0,
            is_active=True
        )
        coupon2 = Coupon(
            code="HOMESERVE50",
            description="Flat ₹50 discount for repeat maintenance",
            discount_type="fixed",
            discount_value=50.0,
            min_order_amount=199.0,
            is_active=True
        )
        db.add(coupon1)
        db.add(coupon2)

        # 7. Seed Initial Baseline Bookings for Analytics & Tracking
        logger.info("Seeding initial bookings and invoices...")
        today = datetime.date.today()

        # Completed Booking
        b1 = Booking(
            booking_ref="HS-BK-9801",
            customer_id=cust_profile.id,
            provider_id=prov_profile.id,
            service_id=created_services[0].id,
            address_id=cust_address.id,
            booking_date=today,
            time_slot="10:00 AM - 11:00 AM",
            status="Completed",
            base_price=299.0,
            additional_charges=0.0,
            tax_amount=53.82,
            discount_amount=0.0,
            total_amount=352.82,
            problem_description="Need installation of high-speed BLDC ceiling fan with remote sync."
        )
        db.add(b1)
        db.flush()

        # Assignment
        assign1 = BookingAssignment(
            booking_id=b1.id,
            technician_id=tech_profile.id,
            assigned_by=prov_user.id,
            technician_acknowledged=True,
            arrival_time=datetime.datetime.utcnow() - datetime.timedelta(hours=2),
            work_started_time=datetime.datetime.utcnow() - datetime.timedelta(hours=1, minutes=45),
            work_completed_time=datetime.datetime.utcnow() - datetime.timedelta(minutes=30),
            completion_remarks="Fan assembled, balanced and tested. Remote synced."
        )
        db.add(assign1)

        # History
        hist1 = BookingStatusHistory(
            booking_id=b1.id,
            previous_status="In Progress",
            new_status="Completed",
            changed_by_user_id=tech_user.id,
            notes="Work verified by customer and completed."
        )
        db.add(hist1)

        # Payment
        pay1 = Payment(
            booking_id=b1.id,
            payment_ref="PAY-9801-SIM",
            gateway="razorpay",
            gateway_order_id="order_sim_9801",
            gateway_payment_id="pay_sim_9801",
            gateway_signature="simulated_valid_signature_2026",
            amount=352.82,
            status="Paid",
            payment_method="upi",
            paid_at=datetime.datetime.utcnow()
        )
        db.add(pay1)

        # Invoice
        inv1 = Invoice(
            invoice_number="INV-2026-9801",
            booking_id=b1.id,
            customer_name="Rahul Sharma",
            provider_name="Apex Home & Electrical Solutions",
            subtotal=299.0,
            tax_amount=53.82,
            discount_amount=0.0,
            total_amount=352.82
        )
        db.add(inv1)

        # Provider Earning
        comm1 = round(299.0 * 0.15, 2)
        earn1 = ProviderEarning(
            provider_id=prov_profile.id,
            booking_id=b1.id,
            gross_amount=299.0,
            commission_rate=15.0,
            commission_amount=comm1,
            net_amount=round(299.0 - comm1, 2),
            payout_status="Settled",
            settled_at=datetime.datetime.utcnow()
        )
        db.add(earn1)

        # Review
        rev1 = Review(
            booking_id=b1.id,
            customer_id=cust_profile.id,
            provider_id=prov_profile.id,
            rating=5,
            comment="Ramesh arrived on time and did a neat job assembling the ceiling fan without any noise.",
            provider_reply="Thank you Rahul! Glad you loved our service.",
            replied_at=datetime.datetime.utcnow()
        )
        db.add(rev1)

        # Notification
        notif1 = Notification(
            user_id=cust_user.id,
            title="Service Completed",
            message="Your Ceiling Fan Installation booking has been marked completed by technician Ramesh.",
            event_type="booking_completed",
            reference_id="HS-BK-9801",
            is_read=False
        )
        db.add(notif1)

        db.commit()
        logger.info("Successfully seeded database with commercial-grade baseline records across all entities!")

    except Exception as e:
        db.rollback()
        logger.error(f"Seeding failed: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

