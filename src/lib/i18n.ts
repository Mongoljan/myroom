import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      meta: {
        siteName: "MyRoom",
        home: {
          title: "MyRoom - Modern Hotel Booking Platform",
          description: "Discover exceptional hotels worldwide with instant booking, real-time availability, and unmatched experiences."
        },
        search: {
          title: "Search Hotels | MyRoom",
          description: "Find and compare the best hotel deals. Search by location, dates, and amenities."
        },
        hotel: {
          title: "{{name}} | MyRoom",
          description: "Book {{name}} in {{location}}. Best rates guaranteed with instant confirmation.",
          notFound: "Hotel Not Found"
        },
        destinations: {
          title: "{{name}} - Hotels & Accommodation | MyRoom",
          description: "Find the best hotels and accommodation in {{name}}. Book now with instant confirmation."
        },
        booking: {
          title: "Complete Your Booking | MyRoom",
          description: "Secure your hotel reservation with instant confirmation."
        },
        manageBooking: {
          title: "Manage Booking | MyRoom",
          description: "View and manage your hotel reservation details."
        },
        login: {
          title: "Sign In | MyRoom",
          description: "Sign in to access your bookings and manage your account."
        },
        signup: {
          title: "Create Account | MyRoom",
          description: "Join MyRoom for exclusive deals and easy booking management."
        },
        terms: {
          title: "Terms of Service | MyRoom",
          description: "Read the terms and conditions for using MyRoom hotel booking platform."
        }
      },
      common: {
        loading: "Loading...",
        error: "Error",
        success: "Success",
        cancel: "Cancel",
        confirm: "Confirm",
        save: "Save",
        edit: "Edit",
        delete: "Delete",
        search: "Search",
        filter: "Filter",
        reset: "Reset",
        submit: "Submit",
        close: "Close",
        back: "Back",
        next: "Next",
        previous: "Previous",
        viewAll: "View All",
        readMore: "Read More",
        showMore: "Show More",
        showLess: "Show Less",
        pages: "Pages",
        searching: "Searching...",
        tryAgain: "Try Again",
        addToWishlist: "Add to Wishlist",
        removeFromWishlist: "Remove from Wishlist",
        selectCheckout: "Select check-out",
        done: "Done",
        notAvailable: "Not available",
        checking: "Checking..."
      },
      calendar: {
        sun: "Su",
        mon: "Mo",
        tue: "Tu",
        wed: "We",
        thu: "Th",
        fri: "Fr",
        sat: "Sa",
        months: {
          january: "January",
          february: "February", 
          march: "March",
          april: "April",
          may: "May",
          june: "June",
          july: "July",
          august: "August",
          september: "September",
          october: "October",
          november: "November",
          december: "December"
        }
      },
      breadcrumb: {
        home: "Home",
        hotels: "Hotels",
        hotelDetails: "Hotel Details",
        allHotels: "All Hotels",
        activities: "Activities",
        activityDetails: "Activity Details",
        allActivities: "All Activities",
        tours: "Tours",
        tourDetails: "Tour Details",
        allTours: "All Tours",
        cars: "Cars",
        carDetails: "Car Details",
        allCars: "All Cars",
        cruises: "Cruises",
        cruiseDetails: "Cruise Details",
        allCruises: "All Cruises",
        rentals: "Rentals",
        rentalDetails: "Rental Details",
        allRentals: "All Rentals"
      },
      
      hero: {
        childrenCount: "children",
        roomCount: "room",
        noLocationsFound: "No locations found",
        findPerfect: "Find Your Perfect",
            recentSearches: "Recent searches",
            popularLocations: "Popular locations",
            searchResults: "Search results",
            noResults: "No results found",
            selectLocation: "Please select a destination",
            property: "Hotel",
            hotelsCount: "{{count}} hotels",
        hotelStay: "Hotel Stay",
        discoverHotels: "Discover exceptional hotels worldwide with instant booking, real-time availability, and unmatched experiences.",
        selectDates: "Please select check-in and check-out dates",
        invalidDates: "Check-out date must be after check-in date",
        hotelsWorldwide: "Hotels Worldwide",
        happyCustomers: "Happy Customers",
        customerSupport: "Customer Support"
      },
      footer: {
        allInOneApp: "Your all-in-one travel app",
        followUs: "Follow us on social media",
        getUpdates: "Get Updates & More",
        yourEmail: "Your Email",
        subscribe: "Subscribe",
        allRightsReserved: "All rights reserved",
        privacy: "Privacy",
        terms: "Terms",
        siteMap: "Site Map",
        company: "Company",
        aboutUs: "About Us",
        careers: "Careers",
        press: "Press",
        blog: "Blog",
        support: "Support",
        helpCenter: "Help Center",
        customerService: "Customer Service",
        cancellationPolicy: "Cancellation Policy",
        termsOfService: "Terms of Service",
        privacyPolicy: "Privacy Policy",
        contactUs: "Contact Us",
        address: "Peace Ave 14-6, 2nd Floor, Chingeltei District, Ulaanbaatar 14240, Ulaanbaatar, Mongolia",
        specialOffers: "Special Offers",
        partners: "Partners",
        downloadApp: "Download App",
        cookiePolicy: "Cookie Policy"
      },
      navigation: {
        home: "Home",
        hotels: "Hotels",
        flights: "Flights",
        tours: "Tours",
        cars: "Car Rental",
        activities: "Activities",
        cruises: "Cruises",
        about: "About",
        contact: "Contact",
        blog: "Blog",
        destinations: "Destinations",
        dashboard: "Dashboard",
        profile: "Profile",
        bookings: "My Bookings",
        favorites: "Favorites",
        login: "Login",
        register: "Register",
        logout: "Logout",
        becomeExpert: "Become An Expert",
        signInRegister: "Sign In / Register",
        manageBooking: "Manage Booking",
        signIn: "Sign In",
        signUp: "Sign Up",
        pages: "Pages",
        articles: "Articles",
        advice: "Advice",
        checkOrder: "Check Order",
        hotelLogin: "Hotel Login",
        loginRegister: "Login/Register",
        news: "News",
        updates: "Updates",
        travelTips: "Travel Tips",
        hotelGuide: "Hotel Guide",
        bookingHelp: "Booking Help",
        dates: "Dates",
        selectDates: "Check in - Check out",
        night: "night",
        nights: "nights"
      },
      AuthLogin: {
        signIn: "Sign in to your account",
        subtitle: "Access your bookings, manage trips, and continue where you left off.",
        emailLabel: "Email address",
        emailPlaceholder: "you@example.com",
        passwordLabel: "Password",
        passwordPlaceholder: "Enter your password",
        rememberMe: "Remember me",
        forgotPassword: "Forgot password?",
        signInButton: "Sign in",
        noAccount: "Don't have an account?",
        signUp: "Create one"
      },
      AuthSignup: {
        createAccount: "Create your account",
        subtitle: "Join MyRoom for exclusive deals and easy booking.",
        fullName: "Full name",
        emailAddress: "Email address",
        password: "Password",
        confirmPassword: "Confirm password",
        signUpButton: "Sign up",
        hasAccount: "Already have an account?",
        signIn: "Sign in"
      },
      hotel: {
        title: "Total results",
        search: "Search Hotels",
        destination: "Destination",
        checkIn: "Check In",
        checkOut: "Check Out",
        guests: "Guests",
        rooms: "Rooms",
        adults: "Adults",
        children: "Children",
        findHotels: "Find Hotels",
        pricePerNight: "per night",
        pricePerNightShort: "Price per night",
        totalPrice: "Total price",
        bookNow: "Book Now",
        selectRoom: "Select Room",
        viewDetails: "View Details",
        freeCancellationUntil: "Free cancellation before {{date}}. (No cancellation fee)",
        onlyRoomsLeft: "Only {{count}} rooms left.",
        amenities: "Amenities",
        reviews: "Reviews",
        roomsAndRates: "Rooms & Rates",
        location: "Location",
        policies: "Policies",
        freeCancellation: "Free Cancellation",
        freeWifi: "Free WiFi",
        breakfastIncluded: "Breakfast Included",
        pool: "Swimming Pool",
        gym: "Fitness Center",
        spa: "Spa",
        parking: "Free Parking",
        airConditioning: "Air Conditioning",
        rating: "Rating",
        excellent: "Excellent",
        veryGood: "Very Good",
        good: "Good",
        fair: "Fair",
        poor: "Poor",
        recentlyViewed: "Recently Viewed Hotels",
        recentlyViewedDesc: "Hotels you've recently browsed",
        viewAllRecent: "View All Recent Hotels",
        recommended: "Recommended Hotels",
        recommendedDesc: "Handpicked hotels just for you",
        viewAllRecommended: "View All Recommended Hotels",
        recommendedFilters: {
          popular: "Popular",
          discounted: "Discounted",
          highlyRated: "Highly Rated",
          cheapest: "Cheapest",
          newlyAdded: "Newly Added"
        },
        noCategoryResults: "No hotels match this category",
        filters: {
          all: "All",
          luxury: "Luxury",
          budget: "Budget",
          boutique: "Boutique",
          business: "Business"
        },
        recentlyViewedCount: "{{count}} hotels recently viewed",
        cheapestRoom: "Cheapest Room",
        capacity: "Capacity",
        available: "Available",
        facilities: "Facilities",
        more: "more",
        totalEstimate: "Total Estimate",
        night: "night",
        nights: "nights",
        viewDeal: "View Deal",
        noResults: "No Hotels Found",
        noResultsMessage: "No hotels match your search criteria. Try adjusting your filters.",
        hotelFound: "hotel found",
        hotelsFound: "hotels found",
        forYourSearch: "for your search",
        searchingIn: "Searching in",
        perNight: "per night",
        perRoom: "per room",
        roomsAvailable: "rooms available",
        showOnMap: "Show on map",
        priceUnavailable: "Price unavailable",
        overview: "Overview",
        houseRules: "House Rules",
        faq: "FAQ",
        priceFrom: "Price from",
        goldTierDeal: "Gold Tier Deal",
        noAmenities: "No information available",
        viewOnMap: "View on map",
        others: "Others",
        allFacilities: "All Facilities"
      },
      search: {
        location: "Location",
        locationPlaceholder: "Where are you going?",
        selectLocation: "Select a destination",
        property: "Hotel",
        hotelsCount: "{{count}} hotels",
        popularLocations: "Popular locations",
        searchResults: "Search results",
        checkIn: "Check in",
        checkOut: "Check out",
        guest: "Guest",
        guests: "Guests",
        adults: "Adults",
        children: "Children",
        rooms: "Rooms",
        searchButton: "Search",
        filters: "Filters",
        sortBy: "Sort by",
        priceRange: "Price Range",
        rating: "Rating",
        amenities: "Amenities",
        starRating: "Star Rating",
        facilities: "Facilities",
        neighborhood: "Neighborhood",
        any: "Any",
        wonderful: "Wonderful 4.5+",
        veryGood: "Very good 4+",
        good: "Good 3.5+",
        adultsAgeNote: "Age 13 or above",
        childrenAgeNote: "Age 0-12",
        roomsNote: "Separate accommodations",
        guestsAndRooms: "Guests & Rooms",
        selectDates: "Check in - Check out",
        chooseLocationTitle: "Choose a location",
        results: "Results",
        recentSearches: "Recent searches",
        noResults: "No results found",
        tryAnotherKeyword: "Try another keyword",
        viewMode: {
          list: "List",
          grid: "Grid"
        },
        sortOptions: {
          default:"Sort",
          recommended: "Recommended",
          priceLowToHigh: "Price: Low to High",
          priceHighToLow: "Price: High to Low",
          ratingHighToLow: "Rating: High to Low"
        },
        searchByName: "Search by name",
        searchByNamePlaceholder: "Enter hotel name...",
        pagination: {
          resultsText: "{{start}}-{{end}} of {{total}} hotel results",
          previous: "Previous",
          next: "Next"
        },
        activeFilters: "Selected Filters",
        clearAll: "Clear all",
        discountedPrice: "Discounted price",
        simpleSearch: "Simple search",
        filtersSection: {
          title: "Filters",
          usedByYou: "Your filters",
          loading: "Loading filters...",
          hotelType: "Property Type",
          popularSearches: "Popular searches",
          priceRange: "Price Range",
          roomFeatures: "Room features",
          generalServices: "General services",
          guestRating: "Guest rating",
          outdoorArea: "Outdoor area",
          bedType: "Bed type",
          popularPlaces: "Popular places",
          discounted: "Discounted",
          starsPlus: "{{rating}}+ stars"
        }
      },
      home: {
        popularDestinationsTitle: "Popular destinations",
        popularDestinationsSubtitle: "Explore cities travelers love"
      },
      destinations: {
        ulaanbaatar: "Ulaanbaatar",
        darkhan: "Darkhan",
        erdenet: "Erdenet",
        khuvsgul: "Khuvsgul",
        arkhangai: "Arkhangai",
        khovd: "Khovd",
        murun: "Murun"
      },
      tabs: {
        hotels: "Hotels",
        tour: "Tour",
        activity: "Activity",
        holidayRentals: "Holiday Rentals",
        car: "Car",
        cruise: "Cruise",
        flights: "Flights"
      },
      booking: {
        title: "Booking",
        summary: "Booking Summary",
        guestDetails: "Guest Details",
        paymentDetails: "Payment Details",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        phone: "Phone Number",
        address: "Address",
        city: "City",
        country: "Country",
        zipCode: "ZIP Code",
        cardNumber: "Card Number",
        expiryDate: "Expiry Date",
        cvv: "CVV",
        cardholderName: "Cardholder Name",
        total: "Total",
        subtotal: "Subtotal",
        taxes: "Taxes & Fees",
        discount: "Discount",
        confirmBooking: "Confirm Booking",
        bookingConfirmed: "Booking Confirmed",
        bookingNumber: "Booking Number",
        thankYou: "Thank you for your booking!",
        manage: {
          title: "Manage Your Booking",
          subtitle: "Enter your booking code and PIN to view and manage your reservation",
          bookingCode: "Booking Code",
          pinCode: "PIN Code",
          enterBookingCode: "Enter booking code",
          enterPinCode: "Enter PIN code",
          findBooking: "Find Booking",
          searching: "Searching...",
          bookingSummary: "Booking Summary",
          errorFetch: "Booking not found. Please check your codes.",
          noBookingFound: "No booking found",
          checkInDate: "Check-in",
          checkOutDate: "Check-out",
          status: "Status",
          customerInfo: "Customer Information",
          roomDetails: "Room Details",
          totalAmount: "Total Amount",
          confirm: "Confirm Booking",
          cancel: "Cancel Booking",
          changeDates: "Change Dates",
          confirmQuestion: "Are you sure you want to confirm this booking?",
          cancelQuestion: "Are you sure you want to cancel this booking?",
          updating: "Updating...",
          confirming: "Confirming...",
          canceling: "Canceling...",
          searchButton: "Search Booking",
          autoFilled: "Booking information auto-filled from your recent booking"
        }
      },
      filters: {
        priceRange: "Price Range",
        starRating: "Star Rating",
        amenities: "Amenities",
        propertyType: "Property Type",
        guestRating: "Guest Rating",
        location: "Location",
        deals: "Special Deals",
        applyFilters: "Apply Filters",
        clearFilters: "Clear All Filters"
      },
      faq: {
        title: "FAQ",
        subtitle: "Frequently Asked Questions",
        q1: {
          q: "Can I book a room without creating an account?",
            recentSearches: "Сүүлийн хайлтууд",
            popularLocations: "Алдартай байршлууд",
            searchResults: "Хайлтын үр дүн",
            noResults: "Хайлтын үр дүн олдсонгүй",
            selectLocation: "Очих газраа сонгоно уу",
            property: "Зочид буудал",
            hotelsCount: "{{count}} буудал",
          a: "Yes. You can select and book a room directly without creating an account, but please ensure your information is accurate. We are not responsible for incorrect details provided during booking."
        },
        q2: {
          q: "Are there any additional fees added to the room price on your platform?",
          a: "No. We partner with property owners to offer the best available rates to our users and do not add hidden fees to the published room price."
        },
        q3: {
          q: "How is my booking confirmed?",
          a: "Your booking is confirmed immediately after full payment (100%) of the room charge has been received."
        },
        q4: {
          q: "How long do I have to complete payment to confirm a booking?",
          a: "For individual customers, bookings are typically confirmed within 10 minutes after payment. For organizations, payment must be completed within 3 hours. For very large bookings (over certain thresholds) additional verification by phone may be required."
        },
        q5: {
          q: "How can I get an invoice?",
          a: "An invoice is generated automatically when you proceed to payment. You can download it from the payment page by clicking 'Download Invoice' in the top-right corner of the payment section."
        },
        q6: {
          q: "How can I pay for my booking?",
          a: "You can pay via Qpay or bank transfer. If you choose bank transfer, please enter the correct account and transaction details to ensure your booking is confirmed."
        },
        q7: {
          q: "What if I entered the wrong transaction details when transferring?",
          a: "If incorrect transaction details are provided, your booking will not be confirmed. Please contact our support immediately at 99972626 to report the issue."
        },
        q8: {
          q: "Can I pay in installments or pay on arrival?",
          a: "No. To prevent double bookings and unexpected cancellations, we require 100% prepayment for bookings."
        },
        q9: {
          q: "Can I get an e-barimt (e-receipt)?",
          a: "Yes. Select your customer type (individual, company, or taxpayer) and provide your tax code during booking. The e-receipt will be registered and sent to your email after your stay."
        },
        q10: {
          q: "Can I cancel my booking?",
          a: "Yes. Cancellation policies and fees vary by property, number of guests, room types, and payment amounts. If you cancel after the allowed period, the full payment may be charged."
        },
        q11: {
          q: "Are there fees for cancelling a booking?",
          a: "Cancellation fees depend on the property&apos;s internal policy. Please review the cancellation days and fees shown during booking before confirming."
        },
        q12: {
          q: "How are refunds processed?",
          a: "Refunds are processed according to the property&apos;s cancellation policy; after deducting any applicable fees, refunds are returned within approximately 3 business days."
        },
        q13: {
          q: "What if I cannot arrive on the booked date or will be late?",
          a: "If you do not cancel within the allowed period, the full payment may be charged. If you will be late, please notify the property to arrange your stay for the remaining nights."
        },
        breakfast: "What kind of breakfast is available at {hotelName}?",
        breakfastAnswer: "{hotelName} offers delicious breakfast options. For details about restaurant hours and menu selections, please contact the hotel directly.",
        breakfastAnswerNoRestaurant: "For details about breakfast at {hotelName}, please contact the hotel directly.",
        pool: "Does {hotelName} have a swimming pool?",
        poolAnswer: "Yes, this hotel has a swimming pool. For details about pool hours and rules, please contact the hotel.",
        wifi: "Does {hotelName} have WiFi?",
        wifiAnswer: "Yes, the hotel offers free WiFi internet service.",
        parking: "Does {hotelName} have parking?",
        parkingAnswer: "Yes, the hotel has parking facilities. For details about parking conditions and fees, please contact the hotel.",
        rooms: "What rooms can I book at {hotelName}?",
        roomsAnswer: "You can book the following rooms: Standard Double Room, Suite, Family Room.",
        checkin: "What are the check-in and check-out times at {hotelName}?",
        checkinAnswer: "Check-in: From 14:00. Check-out: Until 12:00.",
        cost: "How much does it cost to stay at {hotelName}?",
        costAnswer: "Prices vary depending on the room you choose, dates, and other factors. Please enter your search dates to see prices.",
        restaurant: "Does {hotelName} have a restaurant?",
        restaurantAnswer: "Yes, this hotel has a restaurant.",
        activities: "What can you do at {hotelName}?",
        activitiesAnswer: "Various activities are available around the hotel.",
        distance: "How far is {hotelName} from the city center?",
        distanceAnswer: "This hotel is located approximately 2 km from the city center.",
        hottub: "Does {hotelName} have a hot tub?",
        hottubAnswer: "Yes, this hotel has a hot tub.",
        families: "Is {hotelName} popular with families?",
        familiesAnswer: "Yes, this hotel is very popular with families."
      },
      partnerships: {
        title: "Our Partnerships",
        subtitle: "Trusted by leading companies worldwide"
      },
      features: {
        whyChooseUs: "Why Choose Us?",
        whyChooseUsDesc: "Discover what makes us different",
        instantConfirmation: "Instant Confirmation",
        instantConfirmationDesc: "Get immediate booking confirmation for all your reservations.",
        fastService: "Fast Service",
        fastServiceDesc: "Experience quick and reliable service with our dedicated team.",
        wideSelection: "Wide Selection",
        wideSelectionDesc: "Choose from thousands of hotels across multiple destinations."
      },
      errors: {
        general: "Something went wrong",
        networkError: "Network error occurred",
        notFound: "Page not found",
        unauthorized: "Unauthorized access",
        validation: "Please check your input",
        booking: "Booking failed",
        payment: "Payment failed"
      },
      roomCard: {
        facilities: "Facilities",
        bathroom: "Bathroom",
        privateBathroom: "Private bathroom",
        foodAndDrink: "Food & Drink",
        fullDay: "Full Day",
        halfDay: "Half Day",
        singleGuest: "Single Guest",
        fullDayPrice: "Full Day Price",
        halfDayPrice: "Half Day Price",
        singleGuestPrice: "Single Guest Price",
        night: "night",
        nights: "nights",
        day: "day",
        days: "days",
        room: "room",
        rooms: "rooms",
        total: "Total",
        onlyLeft: "Only {{count}} left!",
        adult: "adult",
        adults: "adults",
        child: "child",
        children: "children",
        squareMeters: "{{count}}m²",
        select: "Select",
        selected: "Selected",
        standardBed: "Standard bed",
        roomFacilities: "Room Facilities",
        smokingAllowed: "Smoking allowed",
        nonSmoking: "Non-smoking",
        selectedDates: "Selected Dates",
        more: "more"
      },
      hotelRooms: {
        availableRooms: "Available Rooms",
        checkInDate: "Check-in Date",
        checkOutDate: "Check-out Date",
        pricesPerNight: "Prices shown are per night",
        noRoomsAvailable: "No rooms available",
        loaded: "Loaded",
        roomsLoaded: "room(s), but none meet availability criteria.",
        tryDifferentDates: "Please try different dates or contact the hotel directly.",
        totalPrice: "Total price"
      },
      amenitiesLabels: {
        premiumService: "Premium service",
        safeSecure: "Safe & secure",
        popularChoice: "Popular choice",
        variedAmenities: "Varied amenities",
        moreCount: "+{{count}} more"
      },
      similarHotels: {
        title: "Similar hotels",
        discount: "Discount",
        noRating: "No rating",
        priceUnknown: "Price unknown",
        from: "from"
      },
      hotelDetails: {
        starHotel: "{{count}} Star Hotel",
        aboutProperty: "About the property",
        videoTour: "Video Tour",
        defaultDescription: "Enjoy a comfortable stay at {{hotelName}}. Located in the heart of {{city}}, this hotel offers modern amenities and high-quality service to make your stay memorable.",
        hotelGroup: "Hotel Group:",
        independent: "Independent",
        yes: "Yes",
        roomSales: "Room Sales:",
        limitedAvailability: "Limited availability",
        openBooking: "Open booking",
        propertyId: "Property ID:",
        floors: "floors",
        loadingExtra: "Loading additional details...",
        selectRoom: "Select Room",
        facilities: "Facilities",
        reviews: "Reviews",
        faq: "FAQ",
        similarHotels: "Similar Hotels"
      },
      houseRules: {
        title: "House Rules",
        checkInOut: "Check-in / Check-out",
        checkIn: "Check-in:",
        checkOut: "Check-out:",
        cancellation: "Cancellation Policy",
        beforeCancelTime: "Before cancellation time:",
        afterCancelTime: "After cancellation time:",
        cancelTime: "Cancellation time:",
        cancellationDesc: "Cancellation and prepayment policies vary according to accommodation type.",
        children: "Children",
        childrenAllowed: "Children are welcome",
        childrenNotAllowed: "Children are not allowed",
        pets: "Pets",
        petsAllowed: "Pets are allowed",
        petsNotAllowed: "Pets are not allowed",
        breakfast: "Breakfast",
        breakfastPolicy: "Breakfast policy",
        parking: "Parking",
        parkingSituation: "Parking situation",
        noData: "No information available at this time"
      },
      bookingExtra: {
        successTitle: "Booking created successfully!",
        successDesc: "We received your booking. Details will be sent to your email.",
        bookingCode: "Booking Code",
        pinCode: "PIN Code",
        keepCodesInfo: "Keep these codes safe. You'll need them to view, change, or cancel your booking.",
        goHome: "Go to Home",
        manageBooking: "Manage Booking",
        confirmCTA: "Confirm Booking",
        bookingInProgress: "Booking in progress...",
        detailsTitle: "Booking Details",
        selectedRooms: "Selected rooms:",
        stayDates: "Stay dates",
        totalPrice: "Total price:",
        taxesIncluded: "Taxes and service fees included",
        confirmationTitle: "Your booking has been confirmed. Thank you.",
        confirmationSubtitle: "Booking details have been sent to your email. Please check your inbox.",
        bookingConfirmation: "Booking Confirmation",
        hotelInfo: "Hotel Information",
        addressLabel: "Address",
        contactHotel: "Please contact the hotel for details",
        bookingDetailsSection: "Booking Details",
        checkInLabel: "Check-in",
        checkOutLabel: "Check-out",
        guests: "Guests",
        guestName: "Guest Name",
        bookingDateLabel: "Booking Date",
        bookingNumber: "Booking No.",
        pinCodeLabel: "PIN Code",
        bookingNumberCol: "Booking №",
        roomTypeCol: "Room",
        priceCol: "Price per Room",
        quantityCol: "Qty",
        totalCol: "Total",
        totalAmount: "Total Amount",
        taxNote: "VAT included",
        additionalInfo: "Additional Information",
        infoLine1: "Free parking",
        infoLine2: "Free WiFi",
        cancellationPolicy: "Cancellation Policy",
        beforeCancelTime: "Before cancellation time",
        afterCancelTime: "After cancellation time",
        cancelDeadline: "Cancellation deadline",
        cancellationNote: "Cancellation and prepayment policies vary according to booking type.",
        noPolicyInfo: "Please contact the hotel for cancellation policy details.",
        noCancellation: "No cancellation allowed",
        footerNote1: "Thank you for choosing our service.",
        footerNote2: "We strive to make booking easier for you.",
        print: "Print",
        downloadPDF: "Download PDF",
        backHome: "Back to Home"
      },
      terms: {
        title: "Terms of Service",
        date: "Last Updated: 2025/10/31",
        sections: [
          {
            id: 1,
            title: "General Terms",
            description: "“MyRoom” is a digital website and mobile application (hereinafter collectively referred to as “MyRoom”) that, on one hand, provides customers the ability to digitally purchase their desired rooms, and on the other hand, allows hotels, tourist camps, and resorts (hereinafter referred to as “Partner Properties”) to list, sell, and manage their rooms, acting as a bridge connecting these two parties. These Terms of Service are the governing document for the relationship between Customers and Partner Properties (hereinafter collectively referred to as “User”) regarding the use of MyRoom's services.",
            clauses: [
              {
                id: "1.1",
                content: "Before logging in, registering, or placing an order on the MyRoom platform, you must fully familiarize yourself with the 'Terms of Service' and the 'Privacy Policy'. By clicking the 'I accept' button, you are deemed to have accepted all the conditions stipulated in the terms and policy."
              },
              {
                id: "1.2",
                content: "In case of violation of the MyRoom Terms of Service, we reserve the right to temporarily restrict or terminate your access to and use of the platform."
              },
              {
                id: "1.3",
                content: "MyRoom is not responsible for verifying the accuracy and completeness of the information you provide, nor does it assume the obligation to correct or amend the information."
              },
              {
                id: "1.4",
                content: "MyRoom has the obligation to make amendments to the terms of service and to inform users of any changes in a timely manner."
              }
            ]
          },
          {
            id: 2,
            title: "Definitions",
            description: "",
            clauses: [
              {
                id: "2.1",
                content: "“MyRoom” refers to the digital website and mobile application that offers rooms and services from partner properties to customers and digitally handles purchases and other related needs (hereinafter collectively referred to as “MyRoom”);"
              },
              {
                id: "2.2",
                content: "“Customer” refers to a legal entity with full legal capacity that has accepted the MyRoom Terms of Service;"
              },
              {
                id: "2.3",
                content: "“Partner Property” refers to a legally authorized legal entity, individual, or business organization that uses MyRoom to sell rooms and related services;"
              },
              {
                id: "2.4",
                content: "“User” refers to the collective term for both Customers and Partner Properties as users of MyRoom;"
              },
              {
                id: "2.5",
                content: "“Terms of Service” refers to the governing document for the relationship related to the use of the service;"
              },
              {
                id: "2.6",
                content: "“Database” refers to the data repository containing information from customers and partner properties;"
              }
            ]
          },
          {
            id: 3,
            title: "Customer's Rights and Responsibilities",
            description: "",
            clauses: [
              {
                id: "3.1",
                content: "The Customer has the right to purchase a room through the ordering system and receive information about their order, in accordance with the service conditions offered by MyRoom."
              },
              {
                id: "3.2",
                content: "The Customer has the right to freely express related requests, suggestions, complaints, and feedback about the services offered by the MyRoom platform."
              },
              {
                id: "3.3",
                content: "The Customer has the right to benefit from any discounts or promotions associated with MyRoom."
              },
              {
                id: "3.4",
                content: "The Customer is responsible for carefully reading and accepting the Cancellation Policy and Terms of Service of each specific property before confirming their room order on the MyRoom platform."
              },
              {
                id: "3.5",
                content: "The Customer is 100% fully responsible for the accuracy and security of the personal information they have placed on MyRoom."
              },
              {
                id: "3.6",
                content: "The Customer is responsible for maintaining the security of their account, personal information, and password. You must not share your login information and password with others, and the Customer is 100% fully responsible for any issues arising from sharing it."
              },
              {
                id: "3.7",
                content: "The Customer assumes 100% full responsibility for the accuracy of the information they have provided on the order form. MyRoom assumes no responsibility for any incorrect, erroneous, or incomplete information provided by the Customer."
              },
              {
                id: "3.8",
                content: "Both parties are fully responsible for all types of confidentiality related to the Customer's account information, payments, and other personal data."
              },
              {
                id: "3.9",
                content: "If a Customer deletes their registered account of their own accord or if their account is terminated due to violation of the Terms of Service, all their data, including their account, order history, saved lists, promo codes, and any reviews or comments left, will be permanently deleted from the MyRoom database."
              },
              {
                id: "3.10",
                content: "The Customer undertakes not to distribute, publish, share, store, delete, or violate the 'Privacy Policy' regarding any content related to MyRoom."
              }
            ]
          },
          {
            id: 4,
            title: "Partner Property's Rights and Responsibilities",
            description: "",
            clauses: [
              {
                id: "4.1",
                content: "The Partner Property is 100% fully responsible for the accuracy and security of all personal and organizational information and other documents they have placed on MyRoom."
              },
              {
                id: "4.2",
                content: "The Partner Property is responsible for maintaining the security of its account, personal information, and password. You must not share your login information and password with others, and the Partner Property is 100% fully responsible for any issues arising from sharing it."
              },
              {
                id: "4.3",
                content: "If an admin or other relevant person of the Partner Property deletes their registered account of their own accord or if their account is terminated due to violation of the Terms of Service, all information related to their personal account will be deleted from the MyRoom database."
              },
              {
                id: "4.4",
                content: "The Partner Property is responsible for protecting the Customer's personal information, payments, and all other confidential information."
              },
              {
                id: "4.5",
                content: "The Partner Property may enter and sell information about its organization and rooms on MyRoom, provided that this information does not contain the following: 4.5.1 Words, sentences, or text with meanings unrelated to the organization and rooms; 4.5.2 Using the name, logo, or trademark of a company unrelated to their own organization; 4.5.3 Using words with hidden meanings that are incomprehensible to customers; 4.5.4 Using false, erroneous, or incorrect information, or content that is immoral, fraudulent, threatening, discriminatory based on race, color, or ethnicity, or contains overt or covert insults;"
              },
              {
                id: "4.6",
                content: "The Partner Property is prohibited from using its organizational account for the following purposes: 4.6.1 Using it in a manner inconsistent with laws regarding the confidentiality of personal and business information and intellectual property; 4.6.2 Posting any information or content containing links or other content from competing organizations that conduct similar activities to MyRoom; 4.6.3 MyRoom reserves the right to remove any content from the platform that violates the above conditions or is deemed inconsistent with MyRoom's interests."
              },
              {
                id: "4.7",
                content: "If any issue arises during the customer's stay that requires changes, cancellations, or other actions related to the order, the Partner Property must inform and provide information to MyRoom each time. The Partner Property assumes full responsibility for any consequences arising from concealing or not informing MyRoom about issues that arise between the Partner Property and the customer."
              }
            ]
          },
          {
            id: 5,
            title: "MyRoom's Rights and Responsibilities",
            description: "",
            clauses: [
              {
                id: "5.1",
                content: "MyRoom has the right to use Users' personal information for the purpose of resolving user requests and complaints, providing users with information about services, and contacting them."
              },
              {
                id: "5.2",
                content: "MyRoom reserves the right to cancel an order if the Customer fails to make the full payment or violates the Terms of Service or other related documents."
              },
              {
                id: "5.3",
                content: "MyRoom reserves the right to verify with the relevant Bank and Legal Authorities if any illegal activity is observed in the Customer's payment transactions."
              },
              {
                id: "5.4",
                content: "MyRoom is obligated to notify customers and partner properties of any amendments to the Terms of Service."
              },
              {
                id: "5.5",
                content: "MyRoom reserves the right to restrict or terminate a User's access without prior notice if the User violates the Terms of Service, uses fraudulent information, or engages in actions that cause harm to others."
              },
              {
                id: "5.6",
                content: "MyRoom is responsible for strictly storing the personal information, passwords, order history, and payment information of customers and partner properties."
              }
            ]
          },
          {
            id: 6,
            title: "Pricing and Payment Terms",
            description: "",
            clauses: [
              {
                id: "6.1",
                content: "The price of rooms and services offered on MyRoom includes all types of taxes and other charges."
              },
              {
                id: "6.2",
                content: "The price of rooms and services listed on MyRoom is the lowest possible price, excluding any additional fees or booking commissions."
              },
              {
                id: "6.3",
                content: "The order amount does not include the price of other additional services (e.g., mini-bar, extra bed, cleaning service, etc.), and the Customer is fully responsible for these additional costs."
              },
              {
                id: "6.4",
                content: "The number of rooms available on the MyRoom platform and their prices are determined by the respective property, and therefore they are subject to change at any time."
              },
              {
                id: "6.5",
                content: "Order payments can be made by selecting from the payment methods offered by the MyRoom platform (e.g., bank transfer, Qpay, card payment)."
              },
              {
                id: "6.6",
                content: "If a Customer wishes to pay by bank transfer, they are responsible for correctly entering the payment amount and transaction description. The Customer is fully responsible for any consequences arising from incorrect or erroneous amounts or descriptions."
              },
              {
                id: "6.7",
                content: "If the order amount exceeds 5 million, it must be transferred in installments of 5 million. Upon completion of the transfer, you must immediately contact MyRoom at 99972626 to confirm your order. The Customer assumes full responsibility for any consequences, including order cancellation, if they fail to contact us."
              },
              {
                id: "6.8",
                content: "The Customer is fully responsible for any issues arising from paying to the wrong account, providing incorrect card information, delaying payment, or entering incorrect or discrepant amounts and descriptions for the transaction."
              }
            ]
          },
          {
            id: 7,
            title: "Placing and Confirming an Order",
            description: "",
            clauses: [
              {
                id: "7.1",
                content: "If an order is confirmed, it is considered that the order was placed on the basis of having read and accepted the MyRoom Terms of Service and the cancellation policy of the specific property."
              },
              {
                id: "7.2",
                content: "An order is confirmed when the Customer pays the full amount in advance within the given timeframe."
              },
              {
                id: "7.3",
                content: "If the Customer fails to pay for the order within the specified timeframe, the order may be canceled, and MyRoom assumes no responsibility for any related issues."
              },
              {
                id: "7.4",
                content: "Once the order is confirmed, a confirmation email containing the order details will be sent to the Customer's email address."
              },
              {
                id: "7.5",
                content: "The order confirmation email will contain a unique Order Number and Password. It is the Customer's responsibility not to disclose this information. The Customer is fully responsible for any consequences arising from the loss of this information."
              },
              {
                id: "7.6",
                content: "For every order placement, confirmation, modification, fulfillment, and cancellation, MyRoom will send a notification to the Customer's registered email address and phone number."
              },
              {
                id: "7.7",
                content: "The electronic receipt for the order's digital payment will be automatically sent to the e-receipt code provided by the Customer during the ordering process after the service is fulfilled. The e-receipt will also be sent to the Customer's registered email."
              },
              {
                id: "7.8",
                content: "If the Customer plans to arrive earlier or later than the check-in time, they are responsible for informing the property in advance. The property's contact information can be found on the order details page."
              },
              {
                id: "7.9",
                content: "If, due to the Customer's negligence, they fail to provide prior notice as described in 7.8, and the property cancels the order, imposes a penalty, or any other issue arises, MyRoom assumes no responsibility."
              }
            ]
          },
          {
            id: 8,
            title: "Cancellation, Refund, and Modification",
            description: "",
            clauses: [
              {
                id: "8.1",
                content: "By confirming an order on MyRoom, the Customer is deemed to have read and accepted the Cancellation Policy of the specific property."
              },
              {
                id: "8.2",
                content: "Regarding cancellation conditions, the time frame for cancellation, as well as cancellation fees and penalties, may vary depending on the internal rules and regulations of the specific property. The Customer is responsible for reading and familiarizing themselves with these before confirming the order."
              },
              {
                id: "8.3",
                content: "Detailed information about the cancellation conditions, the time frame for cancellation, and the applicable cancellation fees and penalties can be viewed in the 'Customer Information' section during the ordering process. The Cancellation Policy is also included on the order details page and in the confirmation email after the order is confirmed."
              },
              {
                id: "8.4",
                content: "If the property's internal policy allows for cancellation, it can be canceled within the timeframe specified in those conditions."
              },
              {
                id: "8.5",
                content: "If the cancellation occurs after the timeframe specified in the cancellation conditions or if the order was made under a non-cancellable condition, cancellation is not possible, or a strict no-refund policy applies."
              },
              {
                id: "8.6",
                content: "Any refund will be based on the electronic and/or paper contract agreed upon at the time of order confirmation and will also follow the refund policy of the third-party service provider."
              },
              {
                id: "8.7",
                content: "In accordance with the property's internal rules and cancellation policy, the entire payment or a specified percentage may be charged as a cancellation fee. If a refund is applicable, it will be issued to the customer."
              },
              {
                id: "8.8",
                content: "The cancellation fee and penalty will be charged as per the cancellation policy. If a refund is due, it will be processed to the bank account number used for the original payment within 3-5 business days."
              },
              {
                id: "8.9",
                content: "The cancellation policy and the applicable penalties and fees depend on the internal rules and policies of the specific property, so refunds may vary or may not be issued at all."
              },
              {
                id: "8.10",
                content: "A registered Customer on MyRoom can modify their order from the 'Order History' section, while a non-registered Customer can do so from the 'Check Order' section by entering their order number and password (as described in 7.4 and 7.5)."
              },
              {
                id: "8.11",
                content: "You can check if it is possible to extend, move up, or postpone the order dates, or to change the room type and level. Modifications can be made to the order as permitted and offered by MyRoom."
              },
              {
                id: "8.12",
                content: "An order can be modified in the following 2 cases: 8.11.1 Change of Date: You can extend, move up, or postpone the order date only once before the specified deadline. The modification is confirmed after any additional payment is made. If the deadline has passed, the date cannot be changed. 8.11.2 Change of Room: You can only change the room type or level to a higher one for the same room type once. The modification is confirmed after the additional price difference is fully paid. However, you cannot change the room to a lower level."
              },
              {
                id: "8.13",
                content: "In all other cases, modifications to the order are not possible."
              },
              {
                id: "8.14",
                content: "Any notification related to an order modification will be sent directly to the Customer's registered email address and phone number each time."
              },
              {
                id: "8.15",
                content: "If, after arriving at the property, the Customer wishes to change their room without changing the room type, they should contact the property's reception/check-in desk directly."
              },
              {
                id: "8.16",
                content: "If, after arriving at the property, the Customer wishes to change the room type, they must do so exclusively through MyRoom. A change is possible only if MyRoom offers an available alternative room, as per 8.11.2."
              }
            ]
          },
          {
            id: 9,
            title: "Intellectual Property Rights",
            description: "",
            clauses: [
              {
                id: "9.1",
                content: "The MyRoom platform's logo, name, text, design, information, and any content (e.g., design, images, audio, graphics, video, etc.) are the property of MyRoom, protected by copyright, trademark, and other laws. It is prohibited to copy, multiply, imitate, distribute, or use them in any other form without official permission."
              },
              {
                id: "9.2",
                content: "In case of violation of MyRoom's intellectual property rights, the responsible parties will be held accountable under the Intellectual Property Law and other applicable laws."
              }
            ]
          },
          {
            id: 10,
            title: "Dispute Resolution",
            description: "",
            clauses: [
              {
                id: "10.1",
                content: "Any disputes arising from the fulfillment of obligations under this agreement shall be resolved amicably through mutual negotiation. If the parties fail to reach an agreement, the dispute will be resolved in accordance with the laws of Mongolia."
              }
            ]
          },
          {
            id: 11,
            title: "Data Privacy",
            description: "",
            clauses: [
              {
                id: "11.1",
                content: "The privacy of User information is governed by the 'Privacy Policy'."
              }
            ]
          },
          {
            id: 12,
            title: "Other",
            description: "",
            clauses: [
              {
                id: "12.1",
                content: "MyRoom has the obligation to inform its users of any amendments to these Terms of Service."
              },
              {
                id: "12.2",
                content: "MyRoom prioritizes resolving any requests, complaints, issues, or disputes related to its services amicably between the parties. If a situation arises that cannot be resolved, the matter will be handed over to the relevant legal authorities in accordance with the laws and regulations of Mongolia."
              }
            ]
          }
        ]
      }
    }
  },
  mn: {
    translation: {
      meta: {
        siteName: "MyRoom",
        home: {
          title: "MyRoom - Зочид буудал захиалгын платформ",
          description: "Дэлхийн өнцөг булан бүрээс зочид буудал олж, шууд захиалга хийгээрэй."
        },
        search: {
          title: "Зочид буудал хайх | MyRoom",
          description: "Хамгийн сайн зочид буудлын үнийг харьцуулж олоорой."
        },
        hotel: {
          title: "{{name}} | MyRoom",
          description: "{{location}}-д байрлах {{name}}-г захиалах. Хамгийн сайн үнийн баталгаа.",
          notFound: "Зочид буудал олдсонгүй"
        },
        destinations: {
          title: "{{name}} - Зочид буудал & Байр | MyRoom",
          description: "{{name}} дахь хамгийн сайн зочид буудлуудыг олоорой. Одоо захиалаарай."
        },
        booking: {
          title: "Захиалга баталгаажуулах | MyRoom",
          description: "Зочид буудлын захиалгаа баталгаажуулаарай."
        },
        manageBooking: {
          title: "Захиалга удирдах | MyRoom",
          description: "Таны зочид буудлын захиалгын мэдээллийг харах, удирдах."
        },
        login: {
          title: "Нэвтрэх | MyRoom",
          description: "Захиалгуудаа харах, бүртгэлээ удирдахын тулд нэвтрэнэ үү."
        },
        signup: {
          title: "Бүртгүүлэх | MyRoom",
          description: "MyRoom-д нэгдэж онцгой урамшуулал, хялбар захиалгын үйлчилгээ аваарай."
        },
        terms: {
          title: "Үйлчилгээний нөхцөл | MyRoom",
          description: "MyRoom зочид буудал захиалгын платформын үйлчилгээний нөхцөлийг уншина уу."
        }
      },
      common: {
        loading: "Ачааллаж байна...",
        error: "Алдаа",
        success: "Амжилттай",
        cancel: "Цуцлах",
        confirm: "Баталгаажуулах",
        save: "Хадгалах",
        edit: "Засах",
        delete: "Устгах",
        search: "Хайх",
        filter: "Шүүлтүүр",
        reset: "Дахин тохируулах",
        submit: "Илгээх",
        close: "Хаах",
        back: "Буцах",
        next: "Дараах",
        previous: "Өмнөх",
        viewAll: "Бүгдийг харах",
        readMore: "Дэлгэрэнгүй",
        showMore: "Илүү харуулах",
        showLess: "Бага харуулах",
        pages: "Хуудаснууд",
        searching: "Хайж байна...",
        tryAgain: "Дахин оролдох",
        addToWishlist: "Дуртай жагсаалтанд нэмэх",
        removeFromWishlist: "Дуртай жагсаалтаас хасах",
        selectCheckout: "Гарах өдөр сонгох",
        done: "Болсон",
        notAvailable: "Боломжгүй",
        checking: "Шалгаж байна..."
      },
      calendar: {
        sun: "Ня",
        mon: "Да", 
        tue: "Мя",
        wed: "Лх",
        thu: "Пү",
        fri: "Ба",
        sat: "Бя",
        months: {
          january: "1-р сар",
          february: "2-р сар", 
          march: "3-р сар",
          april: "4-р сар",
          may: "5-р сар",
          june: "6-р сар",
          july: "7-р сар",
          august: "8-р сар",
          september: "9-р сар",
          october: "10-р сар",
          november: "11-р сар",
          december: "12-р сар"
        }
      },
      breadcrumb: {
        home: "Нүүр",
        hotels: "Зочид буудал",
        hotelDetails: "Зочид буудлын дэлгэрэнгүй",
        allHotels: "Бүх зочид буудал",
        activities: "Үйл ажиллагаа",
        activityDetails: "Үйл ажиллагааны дэлгэрэнгүй",
        allActivities: "Бүх үйл ажиллагаа",
        tours: "Аялал",
        tourDetails: "Аяллын дэлгэрэнгүй",
        allTours: "Бүх аялал",
        cars: "Машин",
        carDetails: "Машины дэлгэрэнгүй",
        allCars: "Бүх машин",
        cruises: "Далайн аялал",
        cruiseDetails: "Далайн аяллын дэлгэрэнгүй",
        allCruises: "Бүх далайн аялал",
        rentals: "Түрээс",
        rentalDetails: "Түрээсийн дэлгэрэнгүй",
        allRentals: "Бүх түрээс"
      },
      hero: {
        findNextPlace: "Зочлохыг хүсэж байгаа дараагийн газрыг олоорой",
        discoverAmazing: "Онцгой хөнгөлөлттэй гайхамшигтай газруудыг нээрээрэй",
        location: "Байршил",
        whereGoing: "Хаашаа явах вэ?",
        checkInOut: "Орох - Гарах",
        guests: "Зочид",
        guest: "Зочин",
        adults: "Насанд хүрэгчид",
        children: "Хүүхэд",
        rooms: "Өрөө",
        agesNote: "0 - 17 нас",
        adultsCount: "насанд хүрэгчид",
        childrenCount: "хүүхэд",
        roomCount: "өрөө",
        findPerfect: "Төгс хүссэн",
        hotelStay: "Зочид буудал хайх",
        discoverHotels: "Дэлхийн өнцөг булан бүрээс онцгой зочид буудлуудыг олж, шууд захиалга өгөх, бодит цагийн боломжтой байдал болон дүйцэшгүй туршлагыг олж мэдээрэй.",
        selectDates: "Орох болон гарах өдөр сонгоно уу",
        invalidDates: "Гарах өдөр орох өдрөөс хойш байх ёстой",
        hotelsWorldwide: "Дэлхийн зочид буудлууд",
        happyCustomers: "Баяртай хэрэглэгчид",
        customerSupport: "24/7 тусламж үйлчилгээ"
      },
      footer: {
        allInOneApp: "Таны бүх зорчлогын програм",
        followUs: "Биднийг нийгмийн сүлжээнд дагаарай",
        recentlyViewedCount: "Сүүлд үзсэн {{count}} зочид буудал",
        getUpdates: "Мэдээлэл болон илүү ихийг аваарай",
        yourEmail: "Таны имэйл",
        subscribe: "Захиалах",
        recommendedFilters: {
          popular: "Эрэлттэй",
          discounted: "Хямдралтай",
          highlyRated: "Өндөр үнэлгээтэй",
          cheapest: "Хамгийн хямд",
          newlyAdded: "Шинээр нэмэгдсэн"
        },
        noCategoryResults: "Энэ ангилалд зочид буудал байхгүй байна",
        allRightsReserved: "Бүх эрх хуулиар хамгаалагдсан",
        privacy: "Нууцлал",
        terms: "Нөхцөл",
        siteMap: "Сайтын зураг",
        company: "Компани",
        aboutUs: "Бидний тухай",
        careers: "Ажлын байр",
        press: "Хэвлэл мэдээлэл",
        blog: "Блог",
        support: "Дэмжлэг",
        helpCenter: "Тусламжийн төв",
        customerService: "Хэрэглэгчийн үйлчилгээ",
        cancellationPolicy: "Цуцлалтын бодлого",
        termsOfService: "Үйлчилгээний нөхцөл",
        privacyPolicy: "Нууцлалын бодлого",
        contactUs: "Холбоо барих",
        address: "Энхтайваны өргөн чөлөө 14-6, 2 давхар, Чингэлтэй дүүрэг, Улаанбаатар 14240, Улаанбаатар, Монгол Улс",
        specialOffers: "Онцгой санал",
        partners: "Хамтрагч байгууллага",
        downloadApp: "Аппликешн татах",
        cookiePolicy: "Cookie бодлого"
      },
      home: {
        popularDestinationsTitle: "Алдартай байршлууд",
        popularDestinationsSubtitle: "Монгол орны хамгийн алдартай аялалын газрууд"
      },
      destinations: {
        ulaanbaatar: "Улаанбаатар",
        darkhan: "Дархан",
        erdenet: "Эрдэнэт",
        khuvsgul: "Хөвсгөл",
        arkhangai: "Архангай",
        khovd: "Ховд",
        murun: "Мөрөн"
      },
      navigation: {
        home: "Нүүр",
        hotels: "Зочид буудал",
        flights: "Нислэг",
        tours: "Аялал",
        cars: "Машин түрээс",
        activities: "Үйл ажиллагаа",
        cruises: "Усан аялал",
        about: "Бидний тухай",
        contact: "Холбоо барих",
        blog: "Блог",
        destinations: "Очих газар",
        dashboard: "Хяналтын самбар",
        profile: "Профайл",
        bookings: "Миний захиалга",
        favorites: "Дуртай",
        login: "Нэвтрэх",
        register: "Бүртгүүлэх",
        logout: "Гарах",
        becomeExpert: "Мэргэжилтэн болох",
        signInRegister: "Нэвтрэх / Бүртгүүлэх",
        manageBooking: "Захиалга удирдах",
        signIn: "Нэвтрэх",
        signUp: "Бүртгүүлэх",
        pages: "Хуудас",
        articles: "Нийтлэл",
        advice: "Зөвлөгөө",
        checkOrder: "Захиалга шалгах",
        hotelLogin: "Буудлаар нэвтрэх",
        loginRegister: "Нэвтрэх/Бүртгүүлэх",
        news: "Мэдээ",
        updates: "Мэдээлэл",
        travelTips: "Аяллын зөвлөмж",
        hotelGuide: "Зочид буудлын зөвлөгөө",
        bookingHelp: "Захиалгын тусламж",
        dates: "Огноо",
        selectDates: "Орох - Гарах",
        night: "шөнө",
        nights: "шөнө"
      },
      AuthLogin: {
        signIn: "Бүртгэлдээ нэвтрэх",
        subtitle: "Захиалгаа удирдаж, аяллаа үргэлжлүүлэхийн тулд MyRoom бүртгэлээрээ нэвтэрнэ үү.",
        emailLabel: "Имэйл хаяг",
        emailPlaceholder: "you@example.com",
        passwordLabel: "Нууц үг",
        passwordPlaceholder: "Нууц үгээ оруулна уу",
        rememberMe: "Сануулах",
        forgotPassword: "Нууц үгээ мартсан уу?",
        signInButton: "Нэвтрэх",
        noAccount: "Данс байхгүй юу?",
        signUp: "Шинэ бүртгэл үүсгэх"
      },
      AuthSignup: {
        createAccount: "Шинэ бүртгэл үүсгэх",
        subtitle: "MyRoom-д нэгдэж онцгой урамшуулал аваарай.",
        fullName: "Бүтэн нэр",
        emailAddress: "Имэйл хаяг",
        password: "Нууц үг",
        confirmPassword: "Нууц үг баталгаажуулах",
        signUpButton: "Бүртгүүлэх",
        hasAccount: "Бүртгэлтэй юу?",
        signIn: "Нэвтрэх"
      },
      hotel: {
        title: "Нийт илэрц",
        search: "Зочид буудал хайх",
        destination: "Очих газар",
        checkIn: "Ирэх өдөр",
        checkOut: "Явах өдөр",
        guests: "Зочин",
        rooms: "Өрөө",
        adults: "Том хүн",
        children: "Хүүхэд",
        findHotels: "Зочид буудал хайх",
        pricePerNight: "шөнөд",
        pricePerNightShort: "1 шөнийн үнэ",
        totalPrice: "Нийт үнэ",
        bookNow: "Одоо захиалах",
        selectRoom: "Өрөө сонгох",
        viewDetails: "Дэлгэрэнгүй",
        freeCancellationUntil: "{{date}}-нээс өмнө цуцлах боломжтой. (Цуцлалтын хураамжгүй)",
        onlyRoomsLeft: "Сүүлийн {{count}} өрөө үлдлээ.",
        amenities: "Тохижилт",
        reviews: "Сэтгэгдэл",
        roomsAndRates: "Өрөө ба үнэ",
        location: "Байршил",
        policies: "Дүрэм журам",
        freeCancellation: "Үнэгүй цуцлах",
        freeWifi: "Үнэгүй WiFi",
        breakfastIncluded: "Өглөөний цай орсон",
        pool: "Усан сан",
        gym: "Биеийн тамирын заал",
        spa: "Spa",
        parking: "Үнэгүй зогсоол",
        airConditioning: "Агаар цэвэршүүлэгч",
        rating: "Үнэлгээ",
        excellent: "Маш сайн",
        veryGood: "Сайн",
        good: "Дунд зэрэг",
        fair: "Хангалттай",
        poor: "Муу",
        recentlyViewed: "Саяхан үзсэн зочид буудлууд",
        recentlyViewedDesc: "Таны саяхан үзсэн зочид буудлууд",
        viewAllRecent: "Бүх саяхны үзсэн зочид буудлыг үзэх",
        recommended: "Санал болгох",
        recommendedDesc: "Танд тусгайлан сонгосон зочид буудлууд",
        viewAllRecommended: "Бүх санал болгох зочид буудлыг үзэх",
        recommendedFilters: {
          popular: "Эрэлттэй",
          discounted: "Хямдралтай",
          highlyRated: "Өндөр үнэлгээтэй",
          cheapest: "Хамгийн хямд",
          newlyAdded: "Шинээр нэмэгдсэн"
        },
        noCategoryResults: "Энэ ангилалд тохирох зочид буудал алга",
        filters: {
          all: "Бүгд",
          luxury: "Тансаг",
          budget: "Хямд",
          boutique: "Бутик",
          business: "Бизнес"
        },
        recentlyViewedCount: "Сүүлд үзсэн {{count}} зочид буудал",
        cheapestRoom: "Хамгийн хямд өрөө",
        capacity: "Багтаамж",
        available: "Боломжтой",
        facilities: "Тохижилт",
        more: "дэлгэрэнгүй",
        totalEstimate: "Нийт тооцоо",
        night: "шөнө",
        nights: "шөнө",
        viewDeal: "Өртөг харах",
        noResults: "Зочид буудал олдсонгүй",
        noResultsMessage: "Таны хайлтын шалгуурт тохирох зочид буудал олдсонгүй. Хайлтын нөхцөлөө өөрчилж үзээрэй.",
        hotelFound: "зочид буудал олдлоо",
        hotelsFound: "зочид буудал олдлоо",
        forYourSearch: "таны хайлтаар",
        searchingIn: "Хайж байна",
        perNight: "шөнөд",
        perRoom: "өрөөнд",
        roomsAvailable: "өрөө боломжтой",
        showOnMap: "Газрын зураг дээр харах",
        priceUnavailable: "Үнэ тодорхойгүй",
        overview: "Ерөнхий",
        houseRules: "Дотоод журам",
        faq: "Түгээмэл асуулт",
        priceFrom: "Эхлэх үнэ",
        goldTierDeal: "Хямдарсан",
        noAmenities: "Мэдээлэл байхгүй байна",
        viewOnMap: "Газрын зураг дээр харах",
        others: "Бусад",
        allFacilities: "Бүх тохижилт"
      },
      search: {
        location: "Байршил",
        locationPlaceholder: "Хаашаа явах вэ?",
        selectLocation: "Очих газраа сонгоно уу",
        property: "Зочид буудал",
        hotelsCount: "{{count}} буудал",
        popularLocations: "Алдартай байршлууд",
        searchResults: "Хайлтын үр дүн",
        checkIn: "Ирэх өдөр",
        checkOut: "Явах өдөр",
        guest: "Зочин",
        guests: "Зочид",
        adults: "Том хүн",
        children: "Хүүхэд",
        rooms: "Өрөө",
        searchButton: "Хайх",
        filters: "Шүүлтүүр",
        sortBy: "Эрэмбэлэх",
        priceRange: "Үнийн хүрээ",
        rating: "Үнэлгээ",
        amenities: "Тохижилт",
        starRating: "Одны үнэлгээ",
        facilities: "Тохижилт",
        neighborhood: "Хороолол",
        any: "Бүгд",
        wonderful: "Гайхалтай 4.5+",
        veryGood: "Маш сайн 4+",
        good: "Сайн 3.5+",
        adultsAgeNote: "13-аас дээш нас",
        childrenAgeNote: "0-12 нас",
        roomsNote: "Тусдаа өрөө",
        guestsAndRooms: "Зочид ба Өрөө",
        selectDates: "Орох - Гарах",
        chooseLocationTitle: "Газар сонгох",
        results: "Хайлтын үр дүн",
        recentSearches: "Сүүлийн хайлтууд",
        noResults: "Илэрц олдсонгүй",
        tryAnotherKeyword: "Өөр түлхүүр үг оруулж үзээрэй",
        viewMode: {
          list: "Жагсаалт",
          grid: "Сетка"
        },
        sortOptions: {
          default:"Ангилах",
          recommended: "Санал болгосон",
          priceLowToHigh: "Үнэ: багаас их",
          priceHighToLow: "Үнэ: ихээс бага",
          ratingHighToLow: "Үнэлгээ: өндөрөөс нам"
        },
        searchByName: "Нэрээр хайх",
        searchByNamePlaceholder: "Зочид буудлын нэр оруулах...",
        pagination: {
          resultsText: "{{start}}-{{end}} нийт {{total}} буудлын үр дүн",
          previous: "Өмнөх",
          next: "Дараах"
        },
        activeFilters: "Сонгосон шүүлтүүр",
        clearAll: "Бүгдийг арилгах",
        discountedPrice: "Хямдралтай үнэ",
        simpleSearch: "Энгийн хайлт",
        filtersSection: {
          title: "Шүүлтүүр",
          usedByYou: "Таны ашигласан",
          loading: "Шүүлтүүр ачааллаж байна...",
          hotelType: "Үл хөдлөх хөрөнгийн төрөл",
          propertyCategories: {
            budget: "Хямд",
            midRange: "Дунд зэрэглэл",
            luxury: "Тансаг зэрэглэл",
            familyFriendly: "Гэр бүлд зориулсан",
            business: "Бизнес"
          },
          popularSearches: "Түгээмэл хайлтууд",
          priceRange: "Үнийн хязгаар",
          price: "Үнэ",
          hotelStarRating: "Буудлын зэрэглэл",
          roomFeatures: "Өрөөний онцлог зүйлс",
          generalServices: "Ерөнхий үйлчилгээ",
          guestRating: "Зочдын үнэлгээ",
          outdoorArea: "Гадаах талбай",
          bedType: "Орны төрөл",
          popularPlaces: "Алдартай газрууд",
          discounted: "Хямдралтай",
          starsPlus: "{{rating}}+ од"
        }
      },
      tabs: {
        hotels: "Зочид буудал",
        tour: "Аялал",
        activity: "Үйл ажиллагаа",
        holidayRentals: "Амралтын түрээс",
        car: "Машин",
        cruise: "Усан аялал",
        flights: "Нислэг"
      },
      booking: {
        title: "Захиалга",
        summary: "Захиалгын хураангуй",
        guestDetails: "Зочны мэдээлэл",
        paymentDetails: "Төлбөрийн мэдээлэл",
        firstName: "Нэр",
        lastName: "Овог",
        email: "Имэйл",
        phone: "Утасны дугаар",
        address: "Хаяг",
        city: "Хот",
        country: "Улс",
        zipCode: "Шуудангийн код",
        cardNumber: "Картын дугаар",
        expiryDate: "Дуусах хугацаа",
        cvv: "CVV",
        cardholderName: "Картын эзний нэр",
        total: "Нийт",
        subtotal: "Дэд нийлбэр",
        taxes: "Татвар, хураамж",
        discount: "Хөнгөлөлт",
        confirmBooking: "Захиалга баталгаажуулах",
        bookingConfirmed: "Захиалга баталгаажлаа",
        bookingNumber: "Захиалгын дугаар",
        thankYou: "Захиалга өгсөнд баярлалаа!",
        manage: {
          title: "Захиалгаа удирдах",
          subtitle: "Захиалгын код болон PIN кодоо оруулж захиалгаа харах, удирдах",
          bookingCode: "Захиалгын код",
          pinCode: "PIN код",
          enterBookingCode: "Захиалгын код оруулна уу",
          enterPinCode: "PIN код оруулна уу",
          findBooking: "Захиалга хайх",
          searching: "Хайж байна...",
          bookingSummary: "Захиалгын тойм",
          searchButton: "Захиалга хайх",
          errorFetch: "Захиалга олдсонгүй. Кодоо шалгана уу.",
          noBookingFound: "Захиалга олдсонгүй",
          checkInDate: "Буудалд ирэх",
          checkOutDate: "Буудлаас гарах",
          status: "Төлөв",
          customerInfo: "Харилцагчийн мэдээлэл",
          roomDetails: "Өрөөний дэлгэрэнгүй",
          totalAmount: "Нийт дүн",
          confirm: "Захиалга баталгаажуулах",
          cancel: "Захиалга цуцлах",
          changeDates: "Огноо өөрчлөх",
          confirmQuestion: "Та энэ захиалгыг баталгаажуулахдаа итгэлтэй байна уу?",
          cancelQuestion: "Та энэ захиалгыг цуцлахдаа итгэлтэй байна уу?",
          updating: "Шинэчилж байна...",
          confirming: "Баталгаажуулж байна...",
          canceling: "Цуцалж байна...",
          autoFilled: "Захиалгын мэдээлэл автоматаар бөглөгдлөө"
        }
      },
      filters: {
        priceRange: "Үнийн хязгаар",
        starRating: "Одны үнэлгээ",
        amenities: "Тохижилт",
        propertyType: "Үл хөдлөх хөрөнгийн төрөл",
        guestRating: "Зочны үнэлгээ",
        location: "Байршил",
        deals: "Тусгай санал",
        applyFilters: "Шүүлтүүр хэрэглэх",
        clearFilters: "Бүх шүүлтүүрийг арилгах"
      },
      faq: {
        title: "Түгээмэл асуултууд",
        subtitle: "Түгээмэл асуугддаг асуултууд",
        q1: { 
          q: "Бүртгэл үүсгэхгүйгээр шууд өрөө захиалах боломжтой юу?", 
          a: "Тийм. Та өөрийн хүссэн өрөөгөө шууд сонгож захиалгаа баталгаажуулахад хангалттай. Харин таны мэдээлэл буруу, зөрсөн нөхцөлд бид хариуцлага хүлээхгүй тул та өөрийн мэдээллээ үнэн зөв бөглөж, захиалгаа хийгээрэй." 
        },
        q2: { 
          q: "Танай платформоор зарж буй өрөөний үнэ дээр ямар нэг нэмэлт төлбөр нэмэгддэг үү?", 
          a: "Үгүй. Бид харилцагч газруудтайгаа түншлэлийн хүрээнд зөвхөн хэрэглэгчддээ зориулсан хамгийн бодит бөгөөд хямд үнийг санал болгодог." 
        },
        q3: { 
          q: "Захиалга хэрхэн баталгаажих вэ?", 
          a: "Та өрөөнийхөө төлбөрийг бүрэн 100% төлсний дараа таны захиалга шууд баталгаажна." 
        },
        q4: { 
          q: "Захиалгыг хэдий хэр хугацаанд баталгаажуулах шаардлагатай вэ?", 
          a: "Хувь хүний хувьд захиалга баталгаажих хугацаа 10 минут бол байгууллагын хувьд 3 цагийн дотор төлбөрөө 100% хийснээр захиалга амжилттай баталгаажна. Хэрэв захиалгын дүн 5 сая-аас дээш тохиолдолд үнийн дүнг хувааж хийн, 99972626 руу мэдэгдэж баталгаажуулахыг анхаарна уу." 
        },
        q5: { 
          q: "Нэхэмжлэх хэрхэн гаргуулж авах вэ?", 
          a: "Та захиалгын төлбөр төлөх рүү шилжсэнээр автоматаар нэхэмжлэх үүсэх бөгөөд төлбөр төлөх нөхцлийн баруун дээд булан дахь 'Нэхэмжлэх татах' дээр дарж татах боломжтой." 
        },
        q6: { 
          q: "Төлбөрөө хэрхэн төлөх боломжтой вэ?", 
          a: "Та өрөөний төлбөрөө Qpay, дансаар гэсэн 2 сонголтоор хийх боломжтой. Хэрэв дансаар шилжүүлэх тохиолдолд данс болон гүйлгээний утгыг үнэн зөв хийж, нягтлан гүйлгээгээ хийгээрэй." 
        },
        q7: { 
          q: "Гүйлгээний утгыг буруу бичиж шилжүүлэг хийсэн бол яах вэ?", 
          a: "Гүйлгээний утга буруу бичиж шилжүүлэг хийсэн тохиолдолд таны захиалга баталгаажихгүй тул та манай 99972626 дугаар луу яаралтай холбогдож мэдэгдээрэй." 
        },
        q8: { 
          q: "Төлбөрөө хувааж төлөх эсвэл очих өдрөө биечлэн төлөх боломжтой юу?", 
          a: "Боломжгүй. Бид хэрэглэгчдийнхээ захиалгыг аль болох давхардах эсвэл цуцлагдах гэнэтийн эрсдэлээс урьдчилан сэргийлэх үүднээс шууд баталгаажуулан, санаа амар тайван аялуулахыг зорьж буй учир төлбөрөө заавал 100% урьдчилан төлөх шаардлагатай." 
        },
        q9: { 
          q: "И-баримт авах боломжтой юу?", 
          a: "Захиалагчийн мэдээлэл бөглөх хэсэг дээр хувь хүн, байгууллага, татвар төлөгч иргэн гэсэн 3 төрлөөс сонгож, кодоо оруулна. Ингээд таныг өрөөндөө байрлаж дууссаны дараа захиалга биелмэгц таны татварын код дээр и-баримт автоматаар бүртгэгдэж, мөн мэйл хаяг руу тань давхар илгээгдэнэ." 
        },
        q10: { 
          q: "Захиалгыг цуцлах боломжтой юу?", 
          a: "Тийм. Бид 2 тал (захиалагч, буудал)-ын харилцан тэгш байдлыг хангах үүднээс хамгийн боломжит бага хураамжтай цуцлах нөхцлийг санал болгож байна. Таны буудаллах газар, хүний тоо, өрөөний тоо, төлбөрийн дүнгээс хамааран заасан хугацаанд багтаан харилцан адилгүй хураамж бодогдохыг анхаарна уу. Заасан боломжит хугацаанаас хэтэрсэн тохиолдолд цуцлах боломжгүй буюу төлбөр 100% суутгагдана." 
        },
        q11: { 
          q: "Захиалга цуцлахад ямар нэг төлбөр авдаг уу?", 
          a: "Таны сонгосон газраас хамааран дотоод журам нь харилцан адилгүй учир та захиалга хийх явцад гарч ирж буй цуцлалтын хоног, хураамжтай сайтар танилцаж захиалгаа баталгаажуулаарай." 
        },
        q12: { 
          q: "Захиалгын буцаалт хэрхэн хийгдэх вэ?", 
          a: "Тухайн буудлын цуцлалтын журмын дагуу хураамжийг суутган, үлдсэн буцаалтын дүнг ажлын 3 хоног дотор буцаан олгоно." 
        },
        q13: { 
          q: "Захиалсан өдрөө очиж амжихааргүй эсвэл хоцорч очих болсон тохиолдолд яах вэ?", 
          a: "Тухайн буудлын боломжит заасан хугацаанд багтаан захиалгаа цуцлаагүй тохиолдолд төлбөр 100% суутгагдана. Очих өдрөө хоцорч ирж байгаа тохиолдолд үлдсэн хоногтоо байрших эсэхээ буудалдаа мэдэгдэж байрших боломжтой." 
        },
        stillHaveQuestions: "Асуулт байгаа юу? Бид танд туслахад бэлэн байна!",
        contactSupport: "Дэмжлэг авах",
        breakfast: "{hotelName}-д ямар цайны хоол өгдөг вэ?",
        breakfastAnswer: "{hotelName}-д амттай цайны хоол өгдөг. Рестораны цагийн хуваарь болон сонголтын талаар дэлгэрэнгүй мэдээлэл авахын тулд зочид буудалтай холбогдоно уу.",
        breakfastAnswerNoRestaurant: "{hotelName}-д цайны хоолны талаар дэлгэрэнгүй мэдээлэл авахын тулд зочид буудалтай шууд холбогдоно уу.",
        pool: "{hotelName}-д усан сан байдаг уу?",
        poolAnswer: "Тийм, энэ зочид буудалд усан сантай. Усан санны цагийн хуваарь болон журмын талаар дэлгэрэнгүй мэдээлэл авахын тулд зочид буудалтай холбогдоно уу.",
        wifi: "{hotelName}-д WiFi байдаг уу?",
        wifiAnswer: "Тийм, зочид буудалд үнэгүй WiFi интернэт үйлчилгээ байдаг.",
        parking: "{hotelName}-д зогсоол байдаг уу?",
        parkingAnswer: "Тийм, зочид буудалд машин зогсоох талбай байдаг. Зогсоолын нөхцөл, үнийн талаар дэлгэрэнгүй мэдээлэл авахын тулд зочид буудалтай холбогдоно уу.",
        rooms: "{hotelName}-д ямар өрөө захиалж болох вэ?",
        roomsAnswer: "Та дараах өрөөнүүдийг захиалж болно: Стандарт хос хүний өрөө, Люкс өрөө, Гэр бүлийн өрөө.",
        checkin: "{hotelName}-д хэзээ ирж, хэзээ явах вэ?",
        checkinAnswer: "Бүртгэл: 14:00-оос эхлэн. Буцах: 12:00 хүртэл.",
        cost: "{hotelName}-д хэдээр амрах вэ?",
        costAnswer: "Үнэ нь сонгосон өрөө, огноо зэргээс хамаарч өөр байна. Та үнийг харахын тулд хайлтынхаа огноог оруулна уу.",
        restaurant: "{hotelName}-д ресторан байдаг уу?",
        restaurantAnswer: "Тийм, энэ зочид буудалд ресторан байдаг.",
        activities: "{hotelName}-д юу хийх боломжтой вэ?",
        activitiesAnswer: "Зочид буудлын эргэн тойронд янз бүрийн үйл ажиллагаа хийх боломжтой.",
        distance: "{hotelName} хотын төвөөс хэр хол байдаг вэ?",
        distanceAnswer: "Энэ зочид буудал хотын төвөөс ойролцоогоор 2 км зайд байрладаг.",
        hottub: "{hotelName}-д халуун ванн байдаг уу?",
        hottubAnswer: "Тийм, энэ зочид буудалд халуун ванн байдаг.",
        families: "{hotelName} гэр бүлтнүүдэд алдартай юу?",
        familiesAnswer: "Тийм, энэ зочид буудал гэр бүлтнүүдэд маш алдартай."
      },
      partnerships: {
        title: "Хамтрагч байгууллагууд",
        subtitle: "Дэлхийн тэргүүлэгч компаниудын итгэлийг хүлээн авсан"
      },
      features: {
        whyChooseUs: "Яагаад биднийг сонгох хэрэгтэй вэ?",
        whyChooseUsDesc: "Биднийг онцгой болгодог зүйлсийг олж мэдээрэй",
        instantConfirmation: "Шууд баталгаажилт",
        instantConfirmationDesc: "Захиалга бүр шууд баталгааждаг тул захиалга давхцах, цуцлагдах зэрэг эрсдэлээс сэргийлж, та санаа амар аяллаа төлөвлөх боломжтой.",
        fastService: "Өрсөлдөхүйц үнэ",
        fastServiceDesc: "Бид танд ямар нэг нэмэлт төлбөргүй, хамгийн боломжит хөнгөлөлттэй үнийг санал болгож байна.",
        wideSelection: "Өргөн сонголт",
        wideSelectionDesc: "Монгол орны томоохон хот, аялал жуулчлалын бүсүүд дэх хамгийн хямдаас эхлээд тансаг зэрэглэлийн буудлуудаас та өөрийн хайж байгаа өрөөгөө хялбар олох боломжтой."
      },
      errors: {
        general: "Алдаа гарлаа",
        networkError: "Сүлжээний алдаа гарлаа",
        notFound: "Хуудас олдсонгүй",
        unauthorized: "Зөвшөөрөлгүй хандалт",
        validation: "Оролтоо шалгана уу",
        booking: "Захиалга амжилтгүй болсон",
        payment: "Төлбөр амжилтгүй болсон"
      },
      roomCard: {
        facilities: "Тохижилт",
        bathroom: "Угаалгын өрөө",
        privateBathroom: "Дотроо ариун цэврийн өрөө",
        foodAndDrink: "Хоол & Ундаа",
        fullDay: "Бүтэн өдөр",
        halfDay: "Хагас өдөр",
        singleGuest: "Нэг зочин",
        fullDayPrice: "Бүтэн өдрийн үнэ",
        halfDayPrice: "Хагас өдрийн үнэ",
        singleGuestPrice: "Нэг зочны үнэ",
        night: "шөнө",
        nights: "шөнө",
        day: "өдөр",
        days: "өдөр",
        room: "өрөө",
        rooms: "өрөө",
        total: "Нийт",
        onlyLeft: "Зөвхөн {{count}} үлдлээ!",
        adult: "том хүн",
        adults: "том хүн",
        child: "хүүхэд",
        children: "хүүхэд",
        squareMeters: "{{count}}м²",
        select: "Сонгох",
        selected: "Сонгосон",
        standardBed: "Стандарт ор",
        roomFacilities: "Өрөөний тохижилт",
        smokingAllowed: "Тамхи татах боломжтой",
        nonSmoking: "Тамхи татахгүй",
        selectedDates: "Сонгосон огноо",
        more: "бусад"
      },
      hotelRooms: {
        availableRooms: "Боломжтой өрөөнүүд",
        checkInDate: "Буух огноо",
        checkOutDate: "Гарах огноо",
        pricesPerNight: "Үнэ нь нэг шөнөөр тооцогдоно",
        noRoomsAvailable: "Боломжтой өрөө байхгүй байна",
        loaded: "Ачааллагдсан",
        roomsLoaded: "өрөө(нүүд), гэхдээ хэн нь боломжит шалгуурыг хангахгүй байна.",
        tryDifferentDates: "Өөр огноо турших эсвэл зочид буудалтай шууд холбогдоно уу.",
        totalPrice: "Нийт үнэ"
      },
      amenitiesLabels: {
        premiumService: "Дээд зэрэглэлийн үйлчилгээ",
        safeSecure: "Аюулгүй, найдвартай",
        popularChoice: "Алдартай сонголт",
        variedAmenities: "Олон төрлийн тохижилт",
        moreCount: "+{{count}} бусад"
      },
      similarHotels: {
        title: "Ижил төстэй буудлууд",
        discount: "Хямдрал",
        noRating: "Үнэлгээгүй",
        priceUnknown: "Үнэ тодорхойгүй",
        from: "-с эхлэн"
      },
      hotelDetails: {
        starHotel: "{{count}} одтой зочид буудал",
        aboutProperty: "Зочид буудлын тухай",
        videoTour: "Видео танилцуулга",
        defaultDescription: "{{hotelName}} зочид буудалд тав тухтай амарч, {{city}} хотын төвд байрлах орчин үеийн тохижилт, чанартай үйлчилгээг мэдрээрэй.",
        hotelGroup: "Буудлын сүлжээ:",
        independent: "Бие даасан",
        yes: "Тийм",
        roomSales: "Өрөөний борлуулалт:",
        limitedAvailability: "Хязгаарлагдмал",
        openBooking: "Нээлттэй захиалга",
        propertyId: "Үл хөдлөхийн ID:",
        floors: "давхар",
        loadingExtra: "Нэмэлт мэдээлэл ачааллаж байна...",
        selectRoom: "Өрөө сонгох",
        facilities: "Тохижилт",
        reviews: "Үнэлгээ",
        faq: "Түгээмэл асуулт",
        similarHotels: "Төстэй зочид буудлууд"
      },
      houseRules: {
        title: "Дотоод журам",
        checkInOut: "Орох цаг / Гарах цаг",
        checkIn: "Орох цаг:",
        checkOut: "Гарах цаг:",
        cancellation: "Цуцлах бодлого",
        beforeCancelTime: "Цуцлах хугацааны өмнө:",
        afterCancelTime: "Цуцлах хугацааны дараа:",
        cancelTime: "Цуцлах хугацаа:",
        cancellationDesc: "Цуцлах болон урьдчилгаа төлбөрийн бодлого нь захиалгын төрлөөс хамаарч өөр байна.",
        children: "Хүүхэд",
        childrenAllowed: "Хүүхэдтэй зочдыг хүлээн авдаг",
        childrenNotAllowed: "Хүүхэдтэй зочдыг хүлээн авдаггүй",
        pets: "Тэжээвэр амьтан",
        petsAllowed: "Тэжээвэр амьтантай зочдыг хүлээн авдаг",
        petsNotAllowed: "Тэжээвэр амьтан авчрахыг зөвшөөрдөггүй",
        breakfast: "Өглөөний цай",
        breakfastPolicy: "Өглөөний цайны бодлого",
        parking: "Зогсоол",
        parkingSituation: "Зогсоолын нөхцөл",
        noData: "Одоогоор мэдээлэл байхгүй байна"
      },
      bookingExtra: {
        successTitle: "Захиалга амжилттай үүслээ!",
        successDesc: "Таны захиалгыг амжилттай хүлээн авлаа. Дэлгэрэнгүй мэдээллийг и-мэйлээр илгээх болно.",
        bookingCode: "Захиалгын код",
        pinCode: "PIN код",
        keepCodesInfo: "Эдгээр кодуудыг хадгалж байгаарай. Захиалгаа шалгах, өөрчлөх, эсвэл цуцлахдаа ашиглана.",
        goHome: "Нүүр хуудас руу буцах",
        manageBooking: "Захиалга удирдах",
        confirmCTA: "Захиалга баталгаажуулах",
        bookingInProgress: "Захиалж байна...",
        detailsTitle: "Захиалгын дэлгэрэнгүй",
        selectedRooms: "Сонгосон өрөөнүүд:",
        stayDates: "Хугацаа",
        totalPrice: "Нийт үнэ:",
        taxesIncluded: "Татвар болон үйлчилгээний хөлс багтсан",
        confirmationTitle: "Таны захиалга амжилттай баталгаажлаа. Баярлалаа.",
        confirmationSubtitle: "Захиалгын мэдээллийг бид таны имэйл рүү илгээлээ. Та имэйлээ шалгаж үзнэ үү.",
        bookingConfirmation: "Захиалгын хуудас",
        hotelInfo: "Зочид буудлын мэдээлэл",
        addressLabel: "Хаяг",
        contactHotel: "Холбоо барих мэдээллийг зочид буудалтай шалгана уу",
        bookingDetailsSection: "Захиалгын дэлгэрэнгүй",
        checkInLabel: "Орох өдөр",
        checkOutLabel: "Гарах өдөр",
        guests: "Зочид",
        guestName: "Захиалагч",
        bookingDateLabel: "Захиалсан огноо",
        bookingNumber: "Захиалгын №",
        pinCodeLabel: "PIN код",
        bookingNumberCol: "Захиалгын №",
        roomTypeCol: "Өрөө",
        priceCol: "1 өрөөний үнэ",
        quantityCol: "Тоо ш",
        totalCol: "Үнэ",
        totalAmount: "Нийт үнэ",
        taxNote: "НӨАТ багтсан үнэ",
        additionalInfo: "Нэмэлт мэдээлэл",
        infoLine1: "Үнэгүй зогсоол",
        infoLine2: "Free WiFi",
        cancellationPolicy: "Цуцлах нөхцөл",
        beforeCancelTime: "Цуцлах хугацааны өмнө",
        afterCancelTime: "Цуцлах хугацааны дараа",
        cancelDeadline: "Цуцлах хугацаа",
        cancellationNote: "Цуцлах болон урьдчилгаа төлбөрийн бодлого нь захиалгын төрлөөс хамаарч өөр байна.",
        noPolicyInfo: "Цуцлалтын нөхцөлийн талаар зочид буудалтай холбогдоно уу.",
        noCancellation: "Цуцлах боломжгүй",
        footerNote1: "Бидний сонгон үйлчлүүлж байгаад танд баярлалаа.",
        footerNote2: "Бид та бүхэнд үйлчлэх зэргээ улам бүр хялбар болгохоор зорин ажиллаж байна.",
        print: "Хэвлэх",
        downloadPDF: "Татах",
        backHome: "Буцах"
      },
      terms:{
        
        title: "Үйлчилгээний нөхцөл",
        date: "Өөрчлөлт оруулсан огноо: 2025/10/31",
        sections: [
          {
            id: 1,
            title: "Ерөнхий зүйл",
            description: "“MyRoom” нь нэг талаас захиалагчдад өөрийн хүссэн өрөөгөө цахимаар худалдан авах боломжийг хангах, нөгөө талаас буудал, жуулчны бааз, амралтын газруудад /цаашид “Харилцагч газар” гэх/ өрөөгөө байршуулж, зарах, мөн хянах боломжийг бүрдүүлж, энэ 2 талын харилцааг холбох гүүр болж буй цахим вэбсайт болон мобайл аппликейшн /цаашид хамтад нь “MyRoom” гэх/ юм. Энэ Үйлчилгээний нөхцөл нь Захиалагч болон Харилцагч газар /цаашид хамтад нь Хэрэглэгч гэх/-ын “MyRoom”-ийн үйлчилгээг ашиглахтай холбоотой харилцааг зохицуулах баримт бичиг болно.",
            clauses: [
              {
                id: "1.1",
                content: "Та “MyRoom” платформ дээр нэвтэрч, бүртгүүлэх эсвэл захиалга хийхээс өмнө заавал “Үйлчилгээний нөхцөл” болон “Нууцлалын бодлого”-той бүрэн танилцах үүрэгтэй бөгөөд “Би хүлээн зөвшөөрч байна” гэсэн товчийг идэвхжүүлснээр, нөхцөл, бодлогод заасан бүхий л нөхцөлүүдийг хүлээн зөвшөөрсөнд тооцно."
              },
              {
                id: "1.2",
                content: "“MyRoom”-ийн Үйлчилгээний нөхцөлийг зөрчсөн тохиолдолд таны платфомд хандах, ашиглах эрхийг түр хязгаарлах эсвэл цуцлах эрхтэй байна."
              },
              {
                id: "1.3",
                content: "MyRoom нь таны оруулсан мэдээллийн үнэн зөв, бүрэн гүйцэд байдалд баталгаа өгөх эсвэл мэдээллийг засаж өөрчлөх, залруулах үүргийг хүлээхгүй болно."
              },
              {
                id: "1.4",
                content: "“MyRoom” нь үйлчилгээний нөхцөлд нэмэлт өөрчлөлт оруулах, оруулсан өөрчлөлтийг хэрэглэгчдэд цаг тухай бүрт нь мэдээллэх үүрэгтэй байна."
              }
            ]
          },
          {
            id: 2,
            title: "Нэр, үг хэллэгийн тайлбар",
            description: "",
            clauses: [
              {
                id: "2.1",
                content: "“MyRoom” гэж харилцагч газруудын өрөө, үйлчилгээг захиалагчдад санал болгож, худалдан авалт болон түүнтэй холбоотой бусад хэрэгцээг цахимаар шийдэж буй цахим вэбсайт болон мобайл аппликейшн /цаашид хамтад нь “MyRoom” гэх/;"
              },
              {
                id: "2.2",
                content: "“Захиалагч” гэж “MyRoom”-ийн Үйлчилгээний нөхцөлийг хүлээн зөвшөөрсөн иргэний эрх зүйн бүрэн чадамжтай хуулийн этгээд;"
              },
              {
                id: "2.3",
                content: "“Харилцагч газар” гэж “MyRoom”-ээр дамжуулан өрөө борлуулах болон тэдгээртэй холбогдох үйлчилгээ үзүүлэх албан ёсны эрх бүхий хуулийн этгээд, хувь хүн, аж ахуйн нэгж байгууллага"
              },
              {
                id: "2.4",
                content: "“Хэрэглэгч” гэж Захиалагч болон Харилцагч газрыг хамтад нь “MyRoom”-ийн Хэрэглэгч гэж нэгтгэж тодорхойлно;"
              },
              {
                id: "2.5",
                content: "“Үйлчилгээний нөхцөл” гэж үйлчилгээг ашиглахтай холбоотой харилцааг зохицуулах баримт бичиг;"
              },
              {
                id: "2.6",
                content: "“Мэдээллийн сан” гэж захиалагч болон харилцагч газруудын мэдээллийг агуулсан дата сан;"
              }
            ]
          },
          {
            id: 3,
            title: "Захиалагчийн эрх, үүрэг",
            description: "",
            clauses: [
              {
                id: "3.1",
                content: "Захиалагч нь “MyRoom”-ын санал болгож буй үйлчилгээний нөхцөлийн дагуу өрөө захиалгын системээр өрөөг худалдан авах, өөрийн захиалгын талаар мэдээллийг авах эрхтэй байна."
              },
              {
                id: "3.2",
                content: "Захиалагч нь “MyRoom” платформын санал болгож буй үйлчилгээний талаар холбогдох санал хүсэлт болон гомдол, шүүмжээ чөлөөтэй илэрхийлэх эрхтэй байна."
              },
              {
                id: "3.3",
                content: "Захиалагч нь “MyRoom”-той холбоотой ямарваа нэг хөнгөлөлт, урамшууллыг эдлэх эрхтэй байна."
              },
              {
                id: "3.4",
                content: "Захиалагч нь “MyRoom” платформоос өрөө захиалахдаа буудал тус бүрийн Цуцлах нөхцөл болон Үйлчилгээний нөхцөлтэй сайтар уншиж, танилцан зөвшөөрсний дараа захиалгаа баталгаажуулах үүрэгтэй."
              },
              {
                id: "3.5",
                content: "Захиалагч нь “MyRoom” дээр байршуулсан хувийн мэдээллийн үнэн зөв болон аюулгүй байдлыг Захиалагч өөрөө 100% бүрэн хариуцна."
              },
              {
                id: "3.6",
                content: "Захиалагч нь өөрийн бүртгэл, хувийн мэдээлэл болон нууц үгийн аюулгүй байдлыг хангах үүрэгтэй. Та өөрийн нэвтрэх мэдээлэл болон нууц үгийг бусадтай хуваалцахгүй байх үүрэгтэй бөгөөд хэрэв бусадтай хуваалцсаны улмаас гарсан асуудалд хариуцлагыг Захиалагч 100% бүрэн хариуцах үүрэгтэй."
              },
              {
                id: "3.7",
                content: "Захиалагч нь захиалгын мэдээлэл дээр өөрийн бөглөсөн мэдээллийн үнэн зөв байдалд өөрөө 100% бүрэн хариуцлага хүлээнэ. Захиалагчийн бөглөсөн буруу, алдаатай эсвэл дутуу мэдээлэлд “MyRoom”-ийн зүгээс ямар нэг хариуцлага хүлээхгүй болно."
              },
              {
                id: "3.8",
                content: "Захиалагчийн бүртгэлтэй холбоотой хувийн мэдээлэл, төлбөр төлөлт болон бусад бүх төрлийн нууцлалыг 2 тал бүрэн хариуцна."
              },
              {
                id: "3.9",
                content: "Хэрэв Захиалагч нь өөрийн бүртгэлтэй хаягаа өөрийн хүсэлтээр устгасан эсвэл Үйлчилгээний нөхцөлийг зөрчсөний улмаас таны бүртгэлийг цуцалсан тохиолдолд таны бүртгэл, захиалгын түүх, хадгалсан жагсаалт, промо код болон таны үлдээсэн шүүмж, сэтгэгдлүүд зэрэг бүх мэдээллүүд нь “MyRoom”-ийн мэдээллийн сангаас устгагдах болно."
              },
              {
                id: "3.10",
                content: "Захиалагч нь “MyRoom”-тэй холбоотой ямарваа нэг контентыг бусдад дамжуулах, нийтлэх түгээх, хадгалах, устгах, “Нууцлалын бодлого”-ыг зөрчих үйлдлийг гаргахгүй байх үүргийг хүлээнэ."
              }
            ]
          },
          {
            id: 4,
            title: "Харилцагч газрын эрх, үүрэг",
            description: "",
            clauses: [
              {
                id: "4.1",
                content: "Харилцагч газар нь “MyRoom” дээр байршуулсан хувийн болон байгууллагын бүх мэдээлэл болон бусад бичиг баримтын үнэн зөв болон аюулгүй байдлыг Харилцагч газар өөрөө 100% бүрэн хариуцна."
              },
              {
                id: "4.2",
                content: "Харилцагч газар нь өөрийн бүртгэл, хувийн мэдээлэл болон нууц үгийн аюулгүй байдлыг хангах үүрэгтэй. Та өөрийн нэвтрэх мэдээлэл болон нууц үгийг бусадтай хуваалцахгүй байх үүрэгтэй бөгөөд хэрэв бусадтай хуваалцсанаас улмаас гарсан асуудалд хариуцлагыг Харилцагч газар 100% бүрэн хариуцах үүрэгтэй."
              },
              {
                id: "4.3",
                content: "Хэрэв Харилцагч газрын админ эсвэл бусад холбогдох хүмүүс байгууллага дээр бүртгэлтэй өөрийн хаягаа өөрийн хүсэлтээр устгасан эсвэл Үйлчилгээний нөхцөлийг зөрчсөний улмаас таны бүртгэлийг цуцалсан тохиолдолд таны хувийн бүртгэлтэй холбоотой бүх мэдээллүүд нь “MyRoom”-ийн мэдээллийн сангаас устгагдах болно."
              },
              {
                id: "4.4",
                content: "Харилцагч газар нь захиалагчийн хувийн мэдээлэл, төлбөр төлөлт болон бусад бүх төрлийн нууцлалтай холбоотой мэдээллийг хамгаалах үүрэгтэй."
              },
              {
                id: "4.5",
                content: "Харилцагч газар нь “MyRoom” дээр өөрийн байгууллага болон өрөөний талаарх мэдээллийг оруулж, борлуулах боломжтой бөгөөд эдгээрт дараах зүйлийг агуулаагүй байх ёстой. Үүнд: 4.5.1 Байгууллага болон өрөөтэй хамааралгүй утга санаа агуулсан үг өгүүлбэр, текст; 4.5.2 Өөрийн байгууллагатай хамааралгүй компанийн нэр, лого эсвэл худалдааны тэмдэг ашиглах; 4.5.3 Захиалагчдад ойлгомжгүй далд утга санаа бүхий үгс ашиглах; 4.5.4 Худал, алдаатай, буруу мэдээ мэдээлэл эсвэл ёс суртахуунгүй, гүтгэлэг, заналхийлийн шинжтэй, арьс өнгө яс үндэс угсаагаар ялгаварлан гадуурхсан агуулга бүхий эсвэл далд эсвэл илтэд доромжилсон үг өгүүлбэр ашиглах;"
              },
              {
                id: "4.6",
                content: "Харилцагч газар нь өөрийн байгууллагын хаягаа дараах зорилгоор ашиглахыг хориглоно. Үүнд: 4.6.1 Хувь хүний болон аж ахуйн нэгжийн мэдээллийн нууцлал, оюуны өмчтэй холбоотой хууль тогтоомжид нийцэхгүй байдлаар ашиглах; 4.6.2 “MyRoom”-тэй ижил төстэй үйл ажиллагаа явуулдаг өрсөлдөгч байгууллагын ямар нэг холбоос болон бусад контентыг агуулсан мэдээ, мэдээлэл оруулах; 4.6.3 Дээрх нөхцөлүүдийг дагаж мөрдөлгүй зөрчсөн эсвэл “MyRoom”-ийн ашиг сонирхолд нийцэхгүй гэж үзсэн аливаа контентыг платформ дээрээс устгах эрхтэй байна."
              },
              {
                id: "4.7",
                content: "Хэрэв захиалагч буудаллах явцад захиалгатай холбоотой өөрчлөх, цуцлах болон бусад ямар нэг гарсан асуудлыг Харилцагч газар нь “MyRoom” рүү тухай бүрт мэдээллэх, мэдээллээр хангах үүргийг хүлээнэ. Харилцагч газар, захиалагч хоёрын хооронд гарсан асуудлыг “MyRoom”-д мэдээлэлгүй, нуун дарагдуулснаас үүдэн гарах хариуцлагыг Харилцагч газар бүрэн хүлээнэ."
              }
            ]
          },
          {
            id: 5,
            title: "MyRoom эрх, үүрэг",
            description: "",
            clauses: [
              {
                id: "5.1",
                content: "Хэрэглэгчийн хувийн мэдээллийг “MyRoom”-ийн зүгээс хэрэглэгчийн хүсэлт, гомдлыг шийдвэрлэх, хэрэглэгчдэд үйлчилгээний талаар мэдээлэл хүргэх болон холбогдох зорилгоор ашиглах эрхтэй байна."
              },
              {
                id: "5.2",
                content: "Захиалагч захиалгын төлбөрөө бүрэн төлөөгүй эсвэл Үйлчилгээний нөхцөл, бусад холбогдох баримт бичгийг зөрчсөн тохиолдолд захиалгыг цуцлах эрхтэй байна."
              },
              {
                id: "5.3",
                content: "‘MyRoom” нь захиалагчийн төлбөр төлөлт, гүйлгээнд ямар нэг хууль бус зүйл ажиглагдсан тохиолдолд холбогдох Банк болон Хуулийн байгууллагаар шалгуулах эрхтэй."
              },
              {
                id: "5.4",
                content: "“MyRoom” Үйлчилгээний нөхцөлд ямар нэгэн нэмэлт өөрчлөлт орох бүрт захиалагч болон харилцагч газруудад мэдэгдэх үүрэгтэй."
              },
              {
                id: "5.5",
                content: "Захиалагч болон Харилцагч газар нь “MyRoom”-ийн Үйлчилгээний нөхцөлийг зөрчсөн эсвэл ямар нэг хуурамч мэдээлэл ашигласан, бусад хохирол учруулах үйлдэл гаргасан тохиолдолд урьдчилан мэдэгдэх шаардлагагүйгээр нэвтрэх эрхийг нь хязгаарлах болон цуцлах эрхтэй."
              },
              {
                id: "5.6",
                content: "“MyRoom” захиалагч болон харилцагч газрын хувийн мэдээлэл, нууц үг, захиалгын түүх, төлбөр тооцооны мэдээллийг чандлан хадгалах үүрэгтэй."
              }
            ]
          },
          {
            id: 6,
            title: "Үнэ, төлбөрийн нөхцөл",
            description: "",
            clauses: [
              {
                id: "6.1",
                content: "“MyRoom” дээр санал болгож буй өрөө үйлчилгээний үнэд татвар болон бусад бүх төрлийн татварууд багтсан үнэ байна."
              },
              {
                id: "6.2",
                content: "“MyRoom” дээр байршиж буй өрөө үйлчилгээний үнэ дээр ямар нэг нэмэлт төлбөр болон захиалгын шимтгэл багтаагүй хамгийн боломжит, хямд үнэ болно."
              },
              {
                id: "6.3",
                content: "Захиалгын дүнд бусад нэмэлт үйлчилгээ (мини бар, нэмэлт ор, тосох үйлчилгээ гэх мэт)-ний үнэ багтаагүй бөгөөд нэмэлт зардлыг Захиалагч өөрөө бүрэн хариуцна."
              },
              {
                id: "6.4",
                content: "“MyRoom” платформ дээр байрших өрөөний тоо болон өрөөний үнийг тухайн буудлаас тогтоодог учир эдгээр нь хэзээд өөрчлөгдөж, хэлбэлзэх боломжтой."
              },
              {
                id: "6.5",
                content: "Захиалгын төлбөрийг “MyRoom” платформын санал болгож буй төлбөрийн хэрэгсэл (дансаар, Qpay, картаар гэх мэт)-ийн төрлүүдээс сонгон төлөх боломжтой."
              },
              {
                id: "6.6",
                content: "Хэрэв захиалагч төлбөрөө дансаар төлөх гэж байгаа тохиолдолд үнийн дүн болон гүйлгээний утгыг үнэн зөв бөглөх үүрэгтэй бөгөөд үнийн дүн зөрүүтэй болон буруу, алдаатай утгаас үүдэн гарах үр дагаврыг Захиалагч өөрөө бүрэн хариуцна."
              },
              {
                id: "6.7",
                content: "Хэрэв захиалгын дүн 5 саяас дээш тохиолдолд захиалгын дүнг 5 сая тутамд хуваан шилжүүлэх шаардлагатай бөгөөд төлбөрийг шилжүүлж дуусмагц “MyRoom”-ийн 99972626 руу яаралтай холбогдож, захиалгаа баталгаажуулна. Хэрэв бидэнтэй холбогдож мэдэгдээгүйгээс үүдэн захиалга цуцлагдах, бусад гарах үр дагаврыг Захиалагч бүрэн хариуцлага хүлээнэ."
              },
              {
                id: "6.8",
                content: "Захиалгын төлбөрийг буруу дансанд хийх, картын мэдээллийг буруу өгсөн, төлбөрийг хоцроосон, гүйлгээний дүн болон утгыг буруу, зөрүүтэй оруулж шилжүүлсэн зэрэг асуудлын хариуцлагыг Захиалагч өөрөө бүрэн хариуцах үүрэгтэй."
              }
            ]
          },
          {
            id: 7,
            title: "Захиалга хийх, баталгаажих",
            description: "",
            clauses: [
              {
                id: "7.1",
                content: "Хэрэв захиалга баталгаажсан тохиолдолд “MyRoom”-ийн Үйлчилгээний нөхцөл болон тухайн буудлын цуцлалтын нөхцөлтэй танилцаж, хүлээн зөвшөөрсний үндсэн дээр захиалга хийсэн гэж үзнэ."
              },
              {
                id: "7.2",
                content: "Захиалагч захиалгын төлбөрийг өгөгдсөн хугацаанд багтаан, төлбөрөө 100% урьдчилж төлснөөр захиалга баталгаажна."
              },
              {
                id: "7.3",
                content: "Хэрэв захиалагч захиалгын төлбөрөө заасан хугацаанд багтаан төлөөгүйгээс үүдэн захиалга цуцлагдах, үүнтэй холбоотой бусад асуудалд “MyRoom”-ийн зүгээс хариуцлага хүлээхгүй болно."
              },
              {
                id: "7.4",
                content: "Захиалга баталгаажмагц захиалагчийн и-мэйл хаяг рүү захиалгын хуудас бүхий баталгаажсан и-мэйл илгээнэ."
              },
              {
                id: "7.5",
                content: "Захиалгын хуудас бүхий и-мэйлээр дахин давтагдашгүй Захиалгын дугаар, Нууц үгийн хамт ирэх бөгөөд эдгээр мэдээллийг гадагш задруулахгүй байх нь Захиалагчийн үүрэг болно. Энэхүү мэдээллийг алдсанаас үүдэн гарах үр дагаврыг Захиалагч бүрэн хариуцна."
              },
              {
                id: "7.6",
                content: "Захиалга хийх, баталгаажих, өөрчлөх, биелэх болон цуцлах бүрт “MyRoom”-ээс захиалагчийн бүртгүүлсэн и-мэйл хаяг болон гар утас руу мэдэгдэл хүргүүлнэ."
              },
              {
                id: "7.7",
                content: "Захиалгын цахим төлбөрийн И-баримт нь захиалга биелж дууссаны дараа захиалга хийх явцад захиалагчийн өгсөн И-баримтын код руу автоматаар шивэгдэнэ. Мөн захиалагчийн бүртгэлтэй мэйл рүү давхар и-баримтыг илгээнэ."
              },
              {
                id: "7.8",
                content: "Захиалагч нь буудаллах хугацаанаасаа эрт эсвэл оройтож очих бол буудалтайгаа урьдчилж холбогдож мэдэгдэх үүрэгтэй. Буудлын холбогдох мэдээллийг захиалгын хуудаснаасаа харах боломжтой."
              },
              {
                id: "7.9",
                content: "Захиалагчийн хариуцлагагүй байдлаас үүдэн 7.8-д үүссэн нөхцөлийг урьдчилан мэдэгдээгүй тохиолдолд буудал талаас захиалгыг цуцлах болон торгууль төлбөр ногдуулах зэрэг ямар нэг асуудал гарсан тохиолдолд “MyRoom” хариуцлага хүлээхгүй болно."
              }
            ]
          },
          {
            id: 8,
            title: "Цуцлалт, буцаалт болон өөрчлөлт",
            description: "",
            clauses: [
              {
                id: "8.1",
                content: "Захиалагч “MyRoom” дээр захиалгаа баталгаажуулсан тохиолдолд тухайн буудлын Цуцлалтын нөхцөлтэй таницлаж, хүлээн зөвшөөрсөн гэж үзнэ."
              },
              {
                id: "8.2",
                content: "Цуцлах нөхцөлийн хувьд захиалга цуцлах боломжтой хугацаа болон цуцлалтын хураамж, торгууль нь тухайн буудлын дотоод дүрэм, журмаас хамааран харилцан адилгүй байх бөгөөд Захиалагч нь үүнтэй захиалгаа баталгаажуулахаас өмнө уншиж, танилцсан байх үүрэгтэй."
              },
              {
                id: "8.3",
                content: "Цуцлалтын нөхцөл буюу захиалга цуцлах хугацаа болон ногдох цуцлалтын хураамж, торгуулийн талаарх дэлгэрэнгүй мэдээллийг захиалга хийх явцад “Захиалагчийн мэдээлэл” бөглөх хэсэг.дээрээс харах боломжтой. Мөн захиалга баталгаажсны дараа Цуцлалтын нөхцөлийг захиалгын хуудас болон баталгаажсан и-мэйл дээр давхар тусгасан байна."
              },
              {
                id: "8.4",
                content: "Тухайн буудлын дотоод журмын дагуу буудлаас цуцлах боломжтой нөхцөлийг санал болгосон тохиодолд тухайн нөхцөлийн дагуу заасан хугацаанд багтаан цуцлах боломжтой байна."
              },
              {
                id: "8.5",
                content: "Захиалга цуцлах нөхцөл дээр заасан хугацааанаас хэтэрсэн үед болон захиалга анхнаасаа цуцлах боломжгүй гэсэн нөхцөлтэйгээр хийгдсэн тохиолдолд цуцлах боломжгүй буюу төлбөрийн буцаан олголт хийгдэхгүй гэсэн хатуу нөхцөлтэй байна."
              },
              {
                id: "8.6",
                content: "Аливаа буцаалтыг захиалга баталгаажуулах үед харилцан тохиролцсон цахим болон цаасан гэрээн дээр үндэслэх бөгөөд үйлчилгээ үзүүлж буй гуравдагч байгууллагын буцаалтын журмыг давхар мөрдлөг болгоно."
              },
              {
                id: "8.7",
                content: "Тухайн буудлын дотоод журам, цуцлах нөхцөлийн дагуу нийт төлбөрийг бүтэн эсвэл тодорхой хувийг цуцлалтын хураамж болгон суутгах ба хэрэв төлбөрийн буцаан олголт үлдсэн тохиолдолд захиалагчид буцаан олгоно."
              },
              {
                id: "8.8",
                content: "Цуцлалтын нөхцөлийн дагуу торгууль, хураамжийг суутгах ба хэрэв буцаалт төлбөр үлдсэн тохиолдолд зөвхөн захиалагчийн төлбөр төлсөн дугаар данс руу ажлын 3-5 хоног дотор буцаан олгоно."
              },
              {
                id: "8.9",
                content: "Цуцлалтын нөхцөл болон ногдуулах торгууль, хураамж нь тухайн буудлын дотоод журам, бодлогоос хамааран харилцан адилгүй байх учир үүнээс хамааран буцаан олголт өөр өөр эсвэл огт буцаалтгүй байж болно."
              },
              {
                id: "8.10",
                content: "“MyRoom” дээр бүртгэлтэй захиалагч “Захиалгын түүх” цэснээс, харин бүртгэлгүй захиалагч “Захиалга шалгах” хэсэг дээр захиалгын дугаар, нууц үг (7.4 болон 7.5-т дурдсаны дагуу)-ээ оруулан, захиалгаа өөрчлөх боломжтой."
              },
              {
                id: "8.11",
                content: "Тухайн захиалгын өдрийг сунгах, урагшлуулах эсвэл хойшлуулах өдрийг шалгах болон өрөөний төрөл, зэрэглэлийг өөрчлөх боломжтой эсэхийг шалгахад “MyRoom” дээр санал болгож, зөвшөөрсний дагуу захиалгад өөрчлөлт оруулж болно."
              },
              {
                id: "8.12",
                content: "Захиалгыг дараах 2 тохиолдолд өөрчлөх боломжтой гэж үзнэ. 8.11.1 Өдөр солих: Заасан хугацаанаас өмнө зөвхөн 1 удаа захиалгын өдрийг сунгах, урагшлуулах эсвэл хойшлуулах боломжтой ба хэрэв нэмэлт зөрүү төлбөр гарсан тохиолдолд төлбөрийг төлсний дараа баталгаажна. Хэрэв заасан хугацаа хэтэрсэн бол өдөр солих боломжгүй болно. 8.11.2 Өрөө солих: Нэг төрлийн өрөөг зөвхөн 1 удаад төрөл, зэрэглэлийг нь дээшлүүлж солих боломжтой ба нэмэлт зөрүү төлбөр бүрэн төлөгдсөний дараа баталгаажна. Харин өрөөний зэрэглэлийг доошлуулж өөрчлөх боломжгүй."
              },
              {
                id: "8.13",
                content: "Дээрхээс бусад тохиолдолд захиалгад өөрчлөлт оруулах боломжгүй байна."
              },
              {
                id: "8.14",
                content: "Захиалгын өөрчлөлттэй холбоотой мэдэгдэл тухай бүр захиалагчийн бүртгэлтэй и-мэйл хаяг болон утасны дугаар луу шууд илгээгдэнэ."
              },
              {
                id: "8.15",
                content: "Хэрэв Захиалагч буудалдаа очсоны дараа өрөөний төрлийг солихгүйгээр өрөөгөө солиулах шаардлага гарсан тохиолдолд тухайн газрын ресешн/ хүлээн авахтай шууд холбогдоно."
              },
              {
                id: "8.16",
                content: "Хэрэв Захиалагч буудалдаа очсоны дараа өрөөний төрлийг солих шаардлага гарвал зөвхөн “MyRoom”-ээр заавал өрөөг солих шаардлагатай ба 8.11.2-т дурдсаны дагуу “MyRoom”-ээр боломжит сул өрөөг санал болгосон тохиолдолд өөрчлөх боломжтой."
              }
            ]
          },
          {
            id: 9,
            title: "Оюуны өмчийн эрхийн тухай",
            description: "",
            clauses: [
              {
                id: "9.1",
                content: "“MyRoom” платформын лого, нэр, текст, загвар, мэдээлэл, аливаа контент (дизайн, зураг, аудио, график, видео гэх мэт бусад) зэрэг нь зохиогчийн эрх, барааны тэмдэг болон бусад хуулиар хамгаалагдсан “MyRoom”-ийн өмч учир албан ёсны зөвшөөрөлгүйгээр хуулбарлах, олшруулах, дуурайх, тараах, бусад хэлбэрээр ашиглахыг хориглоно."
              },
              {
                id: "9.2",
                content: "“MyRoom”-ийн оюуны өмчийн эрх зөрчигдсөн тохиолдолд холбогдох этгээдэд Оюуны өмчийн тухай хууль болон бусад холбогдох хуулийн дагуу хариуцлага хүлээлгэнэ."
              }
            ]
          },
          {
            id: 10,
            title: "Маргаан шийдвэрлэх",
            description: "",
            clauses: [
              {
                id: "10.1",
                content: "Талууд уг гэрээний үүргийг биелүүлэхтэй холбоотой гарсан ямарваа нэг маргаантай асуудлыг эв зүйгээр харилцан зөвшилцөх замаар шийдвэрлэнэ. Хэрэв харилцан зөвшилцөж, тохиролцож чадаагүй тохиолдолд Монгол Улсын хууль тогтоомжийн дагуу шийдвэрлүүлнэ."
              }
            ]
          },
          {
            id: 11,
            title: "Мэдээллийн нууцлал",
            description: "",
            clauses: [
              {
                id: "11.1",
                content: "Хэрэглэгчийн мэдээллийн нууцлалыг “Нууцлалын бодлого”-оор зохицуулна."
              }
            ]
          },
          {
            id: 12,
            title: "Бусад",
            description: "",
            clauses: [
              {
                id: "12.1",
                content: "“MyRoom” нь энэхүү Үйлчилгээний нөхцөлд нэмэлт өөрчлөлт орох бүрт хэрэглэгчддээ мэдэгдэх үүргийг хүлээнэ."
              },
              {
                id: "12.2",
                content: "“MyRoom”-ийн үйлчилгээтэй холбоотой санал хүсэлт, гомдол, асуудал, маргааныг талууд эвийн журмаар шийдвэрлэхийг эрхэмлэнэ. Хэрэв шийдвэрлэж чадахгүй нөхцөл байдал үүссэн тохиолдолд бол Монгол Улсын хууль, тогтоомжиийн дагуу холбогдох хуулийн байгууллагад хандан шийдвэрлүүлнэ."
              }
            ]
          }
        ]
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'mn',
    lng: 'mn',
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;