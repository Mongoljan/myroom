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
        searching: "Searching",
        findingHotels: "Finding hotels",
        tryAgain: "Try Again",
        addToWishlist: "Add to Wishlist",
        removeFromWishlist: "Remove from Wishlist",
        selectCheckout: "Select check-out",
        done: "Done",
        notAvailable: "Not available",
        checking: "Checking...",
        toggleTheme: "Toggle theme",
        you: "You",
        priceNotAvailable: "Price not available",
        locationUnknown: "Location unknown",
        reviews: "reviews",
        perNight: "per night",
        viewDetails: "View Details"
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
        customerSupport: "Customer Support",
        flipPhrases: [
          "Book your room easily",
          "Instant confirmation",
          "Transparent pricing",
          "Across Mongolia",
          "One place to book"
        ]
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
        cookiePolicy: "Cookie Policy",
        brandName: "GoTrip",
        tagline: "Discover amazing hotels at exclusive deals. Your perfect stay is just a click away.",
        quickLinks: "Quick Links",
        copyright: "© 2025 GoTrip. All rights reserved."
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
        signUp: "Create one",
        loginFailed: "Login failed",
        phoneNumber: "Phone Number",
        orContinueWith: "Or continue with",
        title: "Sign In",
        emailOrPhone: "Email / Phone Number",
        emailOrPhonePlaceholder: "Email or phone number",
        signingIn: "Signing in...",
        register: "Sign Up",
        termsPrefix: "By signing in, you agree to our",
        termsLink: "Terms of Service",
        and: "and",
        privacyLink: "Privacy Policy",
        termsSuffix: "."
      },
      AuthSignup: {
        createAccount: "Create Account",
        subtitle: "Start your journey with us today",
        fullName: "Full name",
        emailAddress: "Email address",
        password: "Password",
        confirmPassword: "Confirm password",
        signUpButton: "Sign Up",
        hasAccount: "Already have an account?",
        signIn: "Sign in",
        passwordMismatch: "Passwords do not match",
        registrationFailed: "Registration failed",
        firstNameLabel: "First Name",
        lastNameLabel: "Last Name",
        emailLabel: "Email Address",
        phoneLabel: "Phone Number",
        optional: "Optional",
        passwordLabel: "Password",
        confirmPasswordLabel: "Confirm Password",
        emailPlaceholder: "you@example.com",
        passwordPlaceholder: "••••••••",
        confirmPasswordPlaceholder: "••••••••",
        creatingAccount: "Creating account...",
        haveAccount: "Already have an account?",
        firstNameRequired: "First name is required",
        lastNameRequired: "Last name is required",
        invalidEmail: "Invalid email address",
        passwordMinLength: "Password must be at least 8 characters",
        passwordLowercase: "Password must contain at least one lowercase letter",
        passwordUppercase: "Password must contain at least one uppercase letter",
        passwordNumber: "Password must contain at least one number",
        confirmPasswordRequired: "Please confirm your password",
        identifierLabel: "Email address / Phone number",
        identifierPlaceholder: "Email address or mobile phone number",
        passwordEnterPlaceholder: "Enter your password",
        confirmPasswordEnterPlaceholder: "Re-enter your password",
        passwordMinCharsRule: "At least 8 characters",
        passwordComplexityRule: "Must include letters, numbers, and symbols",
        passwordMatchOk: "Passwords match",
        termsRequired: "Please accept the Terms of Service",
        termsAgreementPrefix: "By creating an account on our platform, you agree to our",
        termsAgreementSuffix: ".",
        termsLink: "Terms of Service",
        and: "and",
        privacyLink: "Privacy Policy"
      },
      AuthOTP: {
        phoneLogin: "Sign in with Phone",
        verifyCode: "Verify OTP Code",
        phoneSubtitle: "We will send a verification code to your phone",
        codeExpires: "Code expires in {{minutes}} minutes",
        phoneLabel: "Phone Number",
        phonePlaceholder: "99001122",
        firstNameLabel: "First Name",
        lastNameLabel: "Last Name",
        nameHint: "Enter your name if you are a new user",
        sendingOTP: "Sending OTP...",
        getCode: "Get OTP Code",
        backToEmail: "Sign in with Email",
        newAccountCreated: "A new account has been created with your phone number!",
        codeLabel: "OTP code sent to {{phone}}",
        verifying: "Verifying...",
        verify: "Verify",
        back: "Back",
        otpSendError: "Failed to send OTP",
        otpVerifyError: "Failed to verify OTP",
        devOtpAlert: "OTP code (development only): {{code}}"
      },
      Profile: {
        passwordMismatch: "Passwords do not match",
        passwordChanged: "Password changed successfully. Please log in again.",
        title: "Your Profile",
        lastModified: "Last modified",
        updateSuccess: "Profile updated successfully",
        updateError: "An error occurred",
        lastName: "Last Name",
        firstName: "First Name",
        dateOfBirth: "Date of Birth",
        nationality: "Nationality",
        gender: "Gender",
        genderSelect: "Select",
        male: "Male",
        female: "Female",
        other: "Other",
        invoiceLink: "Link Invoice",
        individual: "Individual",
        business: "Individual /business owner/",
        organization: "Organization",
        lastNamePlaceholder: "Last Name",
        firstNamePlaceholder: "First Name",
        updating: "Saving...",
        updateButton: "Update Profile",
        notverified:"Your phone number is not verified."

      },
      ProfilePassword: {
        title: "Change Password",
        currentPassword: "Current Password",
        newPassword: "New Password",
        confirmNewPassword: "Confirm New Password",
        passwordMismatch: "New passwords do not match",
        changeSuccess: "Password changed successfully. Please log in again.",
        changeError: "An error occurred",
        changing: "Changing...",
        changeButton: "Change"
      },
      reviews: {
        title: "Reviews",
        myReviews: "Your Reviews",
        pendingReviews: "Pending Reviews",
        noReviewsTitle: "No reviews yet",
        noReviews: "Complete a booking to write your first review!",
        noPendingTitle: "All caught up!",
        noPendingReviews: "No reviews pending. Complete more bookings to share your experiences!",
        yourRating: "Your rating:",
        writeReview: "Write Review",
        rateExperience: "Rate Your Experience",
        overallRating: "Overall Rating",
        stars: "stars",
        whatDidYouLike: "What did you like?",
        optional: "(Optional)",
        additionalComments: "Additional Comments",
        commentPlaceholder: "Share your experience...",
        cleanliness: "Cleanliness",
        location: "Location",
        food: "Food",
        service: "Service",
        value: "Value",
        comment: "Comment",
        submit: "Submit Review",
        submitting: "Submitting...",
        delete: "Delete",
        bookingNumber: "Booking:",
        completedOn: "Completed:",
        date: "Date:",
        completed: "Completed",
        totalPaid: "Total paid",
        skip: "Skip",
        viewAllReviews: "View all reviews",
        reviewsCount: "{{count}} reviews",
        roomLabel: "Room:",
        stayLabel: "Stay:",
        categoryAll: "All",
        propertyTypes: {
          hotel: "Hotel",
          resort: "Resort",
          camp: "Tourist camp"
        }
      },
      settings: {
        title: "Settings",
        description: "Manage your account preferences and settings",
        languageCurrency: "Language / Currency",
        language: "Language",
        languageDescription: "Choose your preferred display language",
        currency: "Currency",
        currencyDescription: "Choose your preferred currency for prices",
        theme: "Appearance",
        darkMode: "Dark Mode",
        darkModeDesc: "A more comfortable dark theme for your eyes",
        emailSettings: "Email Settings",
        bookingConfirmationEmails: "Booking Confirmation Emails",
        bookingConfirmationEmailsDesc: "Receive email confirmations for your bookings",
        reviewEmails: "Review Email",
        reviewEmailsDesc: "Send a review email to the hotel after your booking is completed, to rate and leave feedback",

        pushNotifications: "Push Notifications",
        notifications: "Notifications",
        notificationsDesc: "Enable push notifications for important updates",
        notificationReceive: "Notification",
        notificationReceiveDesc: "Receive all news and updates related to the site via notifications",
        saved: "Saved!",
        saving: "Saving...",
        saveChanges: "Save Changes",
        accountManagement: "Account Management",
        deleteAccount: "Delete Account",
        deleteAccountWarning: "By deleting your account on our site, all your information will be deleted.",
        confirmDelete: "Are you absolutely sure? Type your password to confirm:",
        passwordPlaceholder: "Enter your password",
        deleting: "Deleting...",
        deleteAccountConfirm: "Delete My Account",
        saveFailed: "Failed to save settings",
        deleteFailed: "Failed to delete account",
        languages: {
          mn: "Mongolian",
          en: "English",
          zh: "Chinese"
        },
        currencies: {
          MNT: "Mongolian Tugrik",
          USD: "US Dollar",
          EUR: "Euro",
          CNY: "Chinese Yuan"
        }
      },
      profileNav: {
        yourProfile: "Your Profile",
        email: "Email",
        phone: "Phone Number",
        changePassword: "Change Password",
        bookingHistory: "Booking History",
        saved: "Saved",
        promoCode: "Promo Code",
        reviews: "Reviews",
        settings: "Settings",
        bookHotel: "Book a Hotel",
        personalInfo: "Personal Information"
      },
      ProfileEmail: {
        title: "Email Address",
        verified: "Your email is verified",
        notVerified: "Your email is not verified",
        changeEmail: "Change Email",
        sending: "Sending...",
        otpSent: "OTP code sent to {{email}}. Please enter the code.",
        otpPlaceholder: "OTP code",
        verifying: "Verifying...",
        verifyButton: "Verify",
        verifySuccess: "Email verified successfully",
        verifyError: "Invalid or expired OTP",
        back: "Back",
        verifyEmail: "Verify Email",
        devOtpCode: "Development OTP Code",
        devOtpHint: "This is only shown in development mode",
        enterNewEmail: "Enter your new email address",
        newEmailPlaceholder: "example@email.com",
        sendCode: "Send Code",
        changeSuccess: "Email changed successfully"
      },
      dashboard: {
        welcomeBack: "Welcome back, {{name}}",
        subtitle: "Manage your bookings and explore new destinations",
        emailNotVerified: "Your email is not verified yet",
        totalBookings: "Total Bookings",
        destinationsVisited: "Destinations Visited",
        upcomingTrips: "Upcoming Trips",
        totalSpent: "Total Spent",
        vsLastMonth: "vs last month",
        bookingHistory: "Booking History",
        loadingBookings: "Loading bookings...",
        noBookings: "No bookings found",
        total: "Total",
        viewAllBookings: "View All Bookings",
        all: "All",
        confirmed: "Confirmed",
        finished: "Finished",
        canceled: "Canceled",
        quickActions: "Quick Actions",
        shortcutsToTasks: "Shortcuts to common tasks",
        newSearch: "New Search",
        findNextDestination: "Find your next destination",
        manageBookings: "Manage Bookings",
        viewModify: "View & modify reservations",
        savedHotels: "Saved Hotels",
        favoriteProperties: "Your favorite properties",
        paymentMethods: "Payment Methods",
        manageCards: "Manage your cards",
        notifications: "Notifications",
        stayUpdated: "Stay updated",
        support: "Support",
        customerService: "24/7 customer service",
        rewards: "Rewards",
        earnPoints: "Earn points & benefits",
        settings: "Settings",
        accountPreferences: "Account preferences",
        upcomingTripsTitle: "Upcoming Trips",
        trip: "Trip",
        trips: "Trips",
        noUpcomingTrips: "No upcoming trips",
        browseHotels: "Browse Hotels",
        viewDetails: "View Details",
        loading: "Loading...",
        checkIn: "Check-in",
        checkOut: "Check-out",
        guests: "Guests",
        room: "Room",
        reviewed: "Reviewed",
        verifyNow: "Verify Now",
        emailVerification: "Email Verification",
        sendingCode: "Sending code...",
        sendCodeTo: "We'll send a verification code to",
        sendCode: "Send Verification Code",
        enterCode: "Enter the 6-digit code sent to",
        codeExpires: "Code expires in {{minutes}} minutes",
        verifyButton: "Verify Email",
        verifying: "Verifying...",
        resendCode: "Resend Code",
        emailVerified: "Email verified successfully!",
        close: "Close"
      },
      saved: {
        title: "Saved Hotels",
        hotelsCount: "hotels saved",
        loading: "Loading your saved hotels...",
        remove: "Remove from saved",
        addedOn: "Added on",
        empty: {
          title: "No saved hotels yet",
          description: "Start exploring and save your favorite hotels!",
          browseHotels: "Browse Hotels"
        }
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
        reviewsSection: {
          noReviews: "No reviews yet",
          beFirst: "Be the first to share your experience!",
          showLess: "Show Less",
          showAll: "Show All {{count}} Reviews",
          ratingBreakdownPlaceholder: "Rating breakdown will be available when review data is integrated"
        },
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
        description: {
          variety: "Hotel with various amenities.",
          luxury: "Excellent service, luxurious environment."
        },
        overview: "Overview",
        houseRules: "House Rules",
        faq: "FAQ",
        priceFrom: "Price from",
        goldTierDeal: "Gold Tier Deal",
        noAmenities: "No information available",
        viewOnMap: "View on map",
        others: "Others",
        allFacilities: "All Facilities",
        surroundings: "Surroundings",
        transport: "Transport",
        landmarks: "Landmarks",
        dining: "Dining",
        shopping: "Shopping",
        open_in_google_maps: "Open in Google Maps",
        no_nearby_places: "No nearby places found",
        viewPhotos: "View photos"
      },
      search: {
        locationPlaceholder: "Where are you going?",
        selectLocation: "Select a destination",
        property: "Hotel",
        hotelsCount: "{{count}} hotels",
        popularLocations: "Popular locations",
        popularDestination: "Popular destinations",
        searchResults: "Search results",
        checkIn: "Check in",
        checkOut: "Check out",
        guest: "Guest",
        guests: "Guests",
        adults: "Adults",
        children: "Children",
        rooms: "Rooms",
        searchButton: "Search",
        errors: {
          invalidCheckoutDate: "Check-out date must be after check-in date"
        },
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
        adultsAgeNote: "Age 18 or above",
        childrenAgeNote: "Age 0-17",
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
        chipGroupCount: "{{groupLabel}} · {{count}}",
        applyFiltersWithCount: "Apply ({{count}} hotels)",
        filtersShort: "Filter",
        starCount: "{{count}} stars",
        chipGroups: {
          propertyType: "Property type",
          starRating: "Star rating",
          roomFeatures: "Main services",
          generalServices: "Services",
          outdoorAreas: "Outdoor facilities",
          accessibility: "Accessibility",
          bedType: "Bed type",
          district: "District",
          landmark: "Location"
        },
        filtersSection: {
          title: "Filters",
          usedByYou: "Last used filters",
          loading: "Loading filters...",
          hotelType: "Property Type",
          popularSearches: "Popular searches",
          priceRange: "Price Range",
          budget: "Budget",
          roomFeatures: "Room features",
          generalServices: "General services",
          generalFacilities: "General facilities",
          additionalFacilities: "Additional facilities",
          activities: "Activities",
          accessibility: "Accessibility",
          neighbourhood: "Neighbourhood",
          landmarks: "Landmarks",
          guestRating: "Guest rating",
          hotelStars: "Hotel stars",
          outdoorArea: "Additional facilities",
          bedType: "Bed type",
          popularPlaces: "Popular places",
          discounted: "Discounted",
          clearAll: "Clear all",
          starsPlus: "{{rating}}+ stars"
        },
        transliterationMatches: "Including transliteration matches"
      },
      datePicker: {
        month: "Month",
        day: "Day",
        year: "Year"
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
      bookingFlow: {
        stepRoom: "Select\nroom",
        stepGuest: "Guest\ndetails",
        stepPayment: "Confirm\npayment",
        guestInfoTitle: "Guest information",
        placeholderLastName: "Your last name",
        placeholderFirstName: "Your first name",
        placeholderEmail: "Email address",
        placeholderPhone: "Phone number",
        LastnameLabel:"Your last name",
        FirstNameLabel:"Your first name",
        EmailLabel:"Email address",
        PhoneLabel:"Phone number",
        ebarimtTitle: "E-Barimt",
        ebarimtAlt: "E-Barimt",
        ebarimtToggleDecline: "Don't take",
        ebarimtToggleAccept: "Will take",
        ebarimtIndividual: "Individual",
        ebarimtOrganization: "Organization",
        ebarimtTaxpayer: "Taxpayer",
        ebarimtSearch: "Search",
        ebarimtOrgRegister: "Organization registration number",
        ebarimtOrgName: "Organization name",
        ebarimtTaxPrefix1: "A",
        ebarimtTaxPrefix2: "A",
        ebarimtTaxNumber: "Registration number",
        ebarimtTaxName: "Taxpayer name",
        ebarimtNotFound: "Registration not found",
        ebarimtConnectionError: "Connection error",
        cancelPolicyAccept: "I accept the cancellation policy.",
        cancelPolicyIntro: "If you cancel, refunds follow the policy below. Some bookings may be non-refundable.",
        cancelFeeTitle: "Cancellation fee:",
        cancelNotAllowed: "Non-refundable",
        cancelFree: "Free",
        noRoomPolicyInfo: "No room policy information",
        cancelPerHotelNote: "*Fees may vary by property policy.",
        cancelAllowed: "Cancellable",
        bookingSummary: "Booking summary",
        selectedRooms: "Your selected rooms:",
        roomCount: "{{count}} room(s)",
        promoPlaceholder: "Enter promo code",
        promoInvalid: "This promo code is not valid.",
        acceptTerms: "Accept terms of service",
        confirmBooking: "Proceed to payment",
        bookingInProgress: "Processing...",
        validation: {
          nameRequired: "Please enter your first name",
          emailRequired: "Please enter your email",
          emailInvalid: "Please enter a valid email address",
          phoneRequired: "Please enter your phone number",
          phoneInvalid: "Please enter a valid phone number",
          cancellationRequired: "Please accept the cancellation policy",
          tosRequired: "Please accept the terms of service",
        },
        mismatchTitle: "Your booking details",
        mismatchSearch: "Your search",
        mismatchSelected: "Selected rooms",
        mismatchCapacity: "Room capacity",
        mismatchGuests: "{{rooms}} room(s), {{adults}} adult(s){{children}}",
        mismatchChildrenSuffix: ", {{count}} child(ren)",
        mismatchWarning: "Your search does not match the selected rooms. Go back and review your room or guest count.",
        mismatchBack: "Back to room selection",
        multiRoomTitle: "Cancellation policy for 2+ rooms",
        multiRoomAllExpired: "Non-refundable — all deadlines have passed.",
        multiRoomNote: "*Fees may vary by property policy.",
        tosTitle: "Terms of service",
        tosScrollHint: "Scroll down to read all terms.",
        tosScrolledOk: "✓ You have read the terms",
        tosScrollContinue: "Scroll down to continue...",
        cancel: "Cancel",
        continue: "Continue",
        tosAccept: "I agree",
        checkInTime: "Check-in",
        checkOutTime: "Check-out",
        nights: "{{count}} night(s)",
        totalDue: "Total due",
        guestCapacity: "Guest capacity",
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        ebarimtTaxpayerPerson: "Registered taxpayer",
        registerNumberLabel: "Registration number",
        orgNameLabel: "Organization name",
        searching: "Searching...",
        basePrice: "Base price",
        vatIncluded: "*VAT included",
        applyPromo: "Apply",
        beforeDeadline: "Before {{deadline}}:",
        afterDeadline: "After {{deadline}}:",
        mismatchGuestMismatchTitle: "Guest count mismatch",
        mismatchUnderstand: "Got it, continue",
        back: "Back",
        multiRoomBeforeCancel: "If cancelled before {{date}}:"
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
        clearFilters: "Clear All Filters",
        categories: {
          budget: "Budget",
          midRange: "Mid-range",
          luxury: "Luxury",
          familyFriendly: "Family-friendly",
          business: "Business"
        },
        popular: {
          breakfast: "Breakfast",
          romantic: "Romantic",
          fiveStar: "5 Stars",
          airportTransport: "Airport Transport",
          wifiIncluded: "Wi-Fi Included"
        },
        bedTypes: {
          single: "Single Bed (90×200 cm)",
          twin: "Twin Bed (2×90×200 cm)",
          double: "Double Bed (140×200 cm)",
          queen: "Queen Bed (160×200 cm)",
          king: "King Bed (180×200 cm)"
        },
        places: {
          center: "City Center",
          airport: "Near Airport",
          shopping: "Shopping District",
          attractions: "Near Attractions",
          transport: "Transport Hub"
        }
      },
      faq: {
        title: "Frequently asked questions",
        subtitle: "Frequently Asked Questions",
        showMore: "Show more",
        showLess: "Show less",
        noAnswer: "An answer for this question is not available yet.",
        q1: {
          q: "Can I book a room without creating an account?",
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
        title: "Why MyRoom?",
        whyChooseUs: "Why Choose Us?",
        whyChooseUsDesc: "Discover what makes us different",
        wideSelection: "Easy search",
        wideSelectionDesc: "Find the room you need across Mongolia in just a few seconds.",
        instantConfirmation: "Instant confirmation",
        instantConfirmationDesc: "Your booking is confirmed as soon as payment is complete — no double-booking risk.",
        fastService: "Transparent pricing",
        fastServiceDesc: "Partner rates with no hidden booking fees on the price you see.",
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
        onlyRoomsLeft: "Only {{count}} left!",
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
        more: "more",
        cancellationPolicy: "Cancellation Policy",
        beforeCancelLabel: "Before {{time}} the day before",
        afterCancelLabel: "After {{time}} the day before",
        freeCancelShort: "free"
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
        totalPrice: "Total price",
        bookRoom: "Book Room",
        numberOfRooms: "Number of Rooms"
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
        similarHotels: "Similar Hotels",
        roomsAvailable: "{{count}}+ rooms available",
        roomsRemaining: "{{count}} rooms remaining",
        premiumClass: "Premium hotel",
        locationUnknown: "Location unknown",
        priceFrom: "from",
        startingPrice: "Starting price",
        night: "night",
        book: "Book",
        viewOnMap: "View on map",
        exceptional: "Exceptional",
        highlyRated: "Highly rated by guests",
        wouldRecommend: "would recommend",
        breakfast: "Breakfast",
        foodDining: "Food & Dining",
        locationInfo: "Location Information",
        provinceCity: "Province/City",
        soumDistrict: "District/Soum",
        totalFloors: "Total Floors",
        propertyHighlights: "Property highlights",
        inCityCenter: "In",
        center: "Center",
        totalRooms: "Total Rooms",
        operatingSince: "Operating since",
        photos: "photos",
        surroundings: "Surroundings",
        showAll: "Show all",
        airportTransfer: "Airport transfer",
        frontDesk24h: "24-hour front desk",
        partOfGroup: "Part of group",
        guestRating: "Guest rating",
        noRatingsYet: "No ratings yet"
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
        enteringGuests: "Number of guests",
        roomCapacityGuests: "Room capacity",
        totalPaidAmount: "Total paid",
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
        backHome: "Back to Home",
        checkIn: "Check-in",
        checkOut: "Check-out",
        night: "night",
        nights: "nights",
        noRoomsSelected: "No rooms selected",
        quantity: "Quantity",
        increaseQuantity: "Increase quantity",
        maxRoomsAvailable: "Maximum {{count}} rooms available",
        totalRooms: "Total Rooms",
        room: "room",
        rooms: "rooms",
        bookRoom: "Book Room",
        duration: "Duration",
        manageBookingTitle: "Manage booking",
        changeDate: "Change dates",
        changeRoom: "Change room",
        addRoom: "Add room",
        cancelBookingAction: "Cancel booking",
        contactHotelTitle: "Contact the hotel",
        hotelLocationMap: "Hotel location",
        invoiceTypeTitle: "Who should the invoice be issued to?",
        invoiceIndividual: "Individual",
        invoiceCompany: "Organization"
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
      },
      payment: {
        timerExpired: "Booking time has expired. Please create a new booking.",
        timerWarning: "Please confirm your booking before time runs out.",
        cancelBooking: "Cancel booking",
        downloadInvoice: "Download invoice",
        selectMethod: "Please select a payment method.",
        methods: {
          bankApp: "Bank app / QR",
          transfer: "Bank transfer",
          wallet: "E-wallet",
          card: "Pay by card"
        },
        checking: "Checking...",
        checkPayment: "Check payment",
        notPaid: "Payment has not been received yet.",
        checkError: "Could not verify payment. Please try again.",
        qpayError: "Failed to create QPay invoice.",
        noteTitle: "Note",
        noteTransferRef: "Please enter the correct transaction reference when transferring.",
        noteTransferAmount: "If the amount is incorrect or the reference does not match, your booking may not be confirmed.",
        bookingSummary: "Booking summary",
        checkInTime: "Check-in",
        checkOutTime: "Check-out",
        nights: "{{count}} night(s)",
        selectedRooms: "Your selected rooms:",
        basePrice: "Base price",
        totalDue: "Total due",
        guestInfo: "Guest information",
        comingSoon: "Coming soon",
        copy: "Copy",
        copied: "Copied",
        accountNumber: "Account number",
        accountName: "Account name",
        bank: "Bank",
        transactionRef: "Transaction reference",
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        banks: {
          tdb: "Trade and Development Bank",
          khan: "Khan Bank"
        },
        accountHolder: "Maya Hotels LLC",
        coupon: "Coupon",
        guestFullName: "Full name:",
        guestPhone: "Phone:",
        guestEmail: "Email:",
        roomCount: "{{count}} room(s)",
        guestCapacity: "Guest capacity:",
        qpayCreating: "Creating QPay invoice...",
        qpayScan: "Scan QPay QR",
        receivingAccount: "Receiving account",
        recipientName: "Recipient name",
        transferAmount: "Transfer amount",
        qrCode: "QR code",
        scanQrShort: "Scan QR",
        comingSoonDesc: "This payment option will be available soon. Please use bank transfer or bank app for now.",
        bookingDescription: "Booking #{{code}} - {{hotel}}"
      },
      profileBookings: {
        title: "Booking History",
        error: "An error occurred.",
        empty: "No bookings found.",
        bookingNumber: "Booking number:",
        date: "Date:",
        nights: "{{count}} night(s)",
        details: "Details",
        payNow: "Continue payment",
        leaveReview: "Leave a review",
        cancel: "Cancel",
        cancelTitle: "Cancel booking",
        pinCode: "PIN code",
        cancelBtn: "Cancel",
        cancelling: "Cancelling...",
        filters: {
          all: "All",
          pending: "Pending payment",
          confirmed: "Confirmed",
          completed: "Completed",
          cancelled: "Cancelled"
        },
        cancelPinHint: "Enter your PIN to cancel booking {{code}}.",
        delete: "Delete",
        deleteComingSoon: "Coming soon",
        deleteTitle: "Delete booking",
        deleteHint: "Booking {{code}} will be permanently removed from your history. This cannot be undone.",
        deleting: "Deleting...",
        reorder: "Book again",
        paymentTimeLeft: "{{time}} left to pay"
      },
      profilePhone: {
        title: "Phone Number",
        invalidNumber: "Invalid phone number.",
        error: "An error occurred.",
        invalidOtp: "Invalid OTP code.",
        verified: "Your phone number is verified.",
        notverified: "Your phone number is not verified.",
        verifyPhone: "Verify number",
        verifySuccess: "Phone number verified successfully.",
        changeSuccess: "Phone number changed successfully.",
        changePhone: "Change phone number",
        enterNewPhone: "Enter the new phone number you want to use.",
        sending: "Sending...",
        getCode: "Get verification code",
        otpHint: "Enter the code sent to your number.",
        verifying: "Verifying...",
        verify: "Verify",
        resend: "Resend"
      },
      profileSaved: {
        title: "Saved",
        all: "All ({{count}})",
        empty: "No saved hotels yet",
        searchHotels: "Search hotels",
        remove: "Remove from saved",
        reviews: "{{count}} reviews",
        pricePerNight: "Price per night (VAT included)"
      },
      profilePromo: {
        title: "Promo Code",
        error: "An error occurred.",
        added: "\"{{code}}\" promo code added.",
        placeholder: "Enter promo code",
        adding: "Adding...",
        add: "Add",
        tabs: {
          active: "Active",
          used: "Used",
          inactive: "Inactive"
        },
        emptyActive: "No active promo codes",
        emptyUsed: "No used promo codes",
        emptyInactive: "No inactive promo codes",
        table: {
          discount: "Discount",
          validPeriod: "Valid period",
          status: "Status",
          code: "Code",
          promoCode: "Promo code",
          discountPercent: "Discount %",
          discountAmount: "Discount % / amount",
          availableCount: "Available uses",
          usedCount: "Times used",
          usedDate: "Date used"
        },
        expired: "— (expired)"
      },
      backendErrors: {
        emailExists: "User with this email already exists",
        phoneExists: "User with this phone already exists"
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
          title: "Захиалга шалгах | MyRoom",
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
        searching: "Хайж байна",
        findingHotels: "Зочид буудал хайж байна",
        tryAgain: "Дахин оролдох",
        addToWishlist: "Дуртай жагсаалтанд нэмэх",
        removeFromWishlist: "Дуртай жагсаалтаас хасах",
        selectCheckout: "Гарах өдөр сонгох",
        done: "Болсон",
        notAvailable: "Боломжгүй",
        checking: "Шалгаж байна...",
        toggleTheme: "Загварыг солих",
        you: "Та",
        priceNotAvailable: "Үнэ тодорхойгүй",
        locationUnknown: "Байршил тодорхойгүй",
        reviews: "сэтгэгдэл",
        perNight: "шөнөд",
        viewDetails: "Дэлгэрэнгүй харах"
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
        adults: "Том хүн",
        children: "Хүүхэд",
        rooms: "Өрөө",
        agesNote: "0 - 17 нас",
        adultsCount: "Том хүн",
        childrenCount: "хүүхэд",
        roomCount: "өрөө",
        findPerfect: "Төгс хүссэн",
        hotelStay: "Зочид буудал хайх",
        discoverHotels: "Дэлхийн өнцөг булан бүрээс онцгой зочид буудлуудыг олж, шууд захиалга өгөх, бодит цагийн боломжтой байдал болон дүйцэшгүй туршлагыг олж мэдээрэй.",
        selectDates: "Орох болон гарах өдөр сонгоно уу",
        invalidDates: "Гарах өдөр орох өдрөөс хойш байх ёстой",
        hotelsWorldwide: "Дэлхийн зочид буудлууд",
        happyCustomers: "Баяртай хэрэглэгчид",
        customerSupport: "24/7 тусламж үйлчилгээ",
        flipPhrases: [
          "Өрөөгөө хялбар захиал",
          "Шууд баталгаажилт",
          "Ил тод үнэ",
          "Монгол даяар",
          "Нэг дор захиалга"
        ]
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
        cookiePolicy: "Cookie бодлого",
        brandName: "GoTrip",
        tagline: "Онцгой хөнгөлөлттэй гайхамшигтай зочид буудлуудыг нээрээрэй. Таны төгс байрлах газар нэг товшилтын зайд.",
        quickLinks: "Шууд холбоосууд",
        copyright: "© 2025 GoTrip. Бүх эрх хуулиар хамгаалагдсан."
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
        manageBooking: "Захиалга шалгах",
        signIn: "Нэвтрэх",
        signUp: "Бүртгүүлэх",
        pages: "Хуудас",
        articles: "Нийтлэл",
        advice: "Тусламж",
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
        signUp: "Шинэ бүртгэл үүсгэх",
        loginFailed: "Нэвтрэхэд алдаа гарлаа",
        phoneNumber: "Утасны дугаар",
        orContinueWith: "Эсвэл",
        title: "Нэвтрэх",
        emailOrPhone: "И-мэйл хаяг / Утасны дугаар",
        emailOrPhonePlaceholder: "И-мэйл эсвэл утасны дугаар",
        signingIn: "Нэвтэрч байна...",
        register: "Бүртгүүлэх",
        termsPrefix: "Та манай платформ дээр бүртгэлээ үүсгэсэн тохиолдолд таныг манай платформын",
        termsLink: "Үйлчилгээний нөхцөл",
        and: "болон",
        privacyLink: "Нууцлалын бодлого",
        termsSuffix: "-ыг хүлээн зөвшөөрсөнд тооцно.",
        noAccount: "Бүртгэлгүй юу?"
      },
      AuthSignup: {
        createAccount: "Шинэ бүртгэл үүсгэх",
        subtitle: "Бидэнтэй хамт аялалаа эхлүүлээрэй",
        fullName: "Бүтэн нэр",
        emailAddress: "Имэйл хаяг",
        password: "Нууц үг",
        confirmPassword: "Нууц үг баталгаажуулах",
        signUpButton: "Бүртгүүлэх",
        hasAccount: "Бүртгэлтэй юу?",
        signIn: "Нэвтрэх",
        passwordMismatch: "Нууц үг таарахгүй байна",
        registrationFailed: "Бүртгэл амжилтгүй боллоо",
        firstNameLabel: "Нэр",
        lastNameLabel: "Овог",
        emailLabel: "Имэйл хаяг",
        phoneLabel: "Утасны дугаар",
        optional: "Заавал биш",
        passwordLabel: "Нууц үг",
        confirmPasswordLabel: "Нууц үг баталгаажуулах",
        emailPlaceholder: "you@example.com",
        passwordPlaceholder: "••••••••",
        confirmPasswordPlaceholder: "••••••••",
        creatingAccount: "Бүртгэл үүсгэж байна...",
        haveAccount: "Бүртгэлтэй юу?",
        firstNameRequired: "Нэр заавал оруулна уу",
        lastNameRequired: "Овог заавал оруулна уу",
        invalidEmail: "Буруу имэйл хаяг",
        passwordMinLength: "Нууц үг дор хаяж 8 тэмдэгт байх ёстой",
        passwordLowercase: "Нууц үг дор хаяж нэг жижиг үсэг агуулсан байх ёстой",
        passwordUppercase: "Нууц үг дор хаяж нэг том үсэг агуулсан байх ёстой",
        passwordNumber: "Нууц үг дор хаяж нэг тоо агуулсан байх ёстой",
        confirmPasswordRequired: "Нууц үгээ баталгаажуулна уу",
        identifierLabel: "И-мэйл хаяг / Утасны дугаар",
        identifierPlaceholder: "И-мэйл хаяг эсвэл гар утасны дугаар",
        passwordEnterPlaceholder: "Нууц үгээ оруулна уу",
        confirmPasswordEnterPlaceholder: "Нууц үгээ давтан оруулна уу",
        passwordMinCharsRule: "8 болон түүнээс дээш тэмдэгт байх",
        passwordComplexityRule: "Үсэг, тоо, тэмдэгт орсон байх",
        passwordMatchOk: "Нууц үг таарч байна",
        termsRequired: "Үйлчилгээний нөхцөлийг зөвшөөрнө үү",
        termsAgreementPrefix: "Та манай платформ дээр бүртгэлээ үүсгэсэн тохиолдолд таныг манай платформын",
        termsAgreementSuffix: "-ыг хүлээн зөвшөөрсөнд тооцно.",
        termsLink: "Үйлчилгээний нөхцөл",
        and: "болон",
        privacyLink: "Нууцлалын бодлого"
      },
      AuthOTP: {
        phoneLogin: "Утсаар нэвтрэх",
        verifyCode: "OTP кодоо баталгаажуулах",
        phoneSubtitle: "Бид таны утас руу баталгаажуулах код илгээх болно",
        codeExpires: "Код {{minutes}} минутад дуусна",
        phoneLabel: "Утасны дугаар",
        phonePlaceholder: "99001122",
        firstNameLabel: "Нэр",
        lastNameLabel: "Овог",
        nameHint: "Шинэ хэрэглэгч бол нэрээ оруулна уу",
        sendingOTP: "OTP илгээж байна...",
        getCode: "OTP код авах",
        backToEmail: "Имэйлээр нэвтрэх",
        newAccountCreated: "Таны утасны дугаараар шинэ бүртгэл үүслээ!",
        codeLabel: "{{phone}} дугаар руу OTP код илгээлээ",
        verifying: "Шалгаж байна...",
        verify: "Баталгаажуулах",
        back: "Буцах",
        otpSendError: "OTP илгээхэд алдаа гарлаа",
        otpVerifyError: "OTP баталгаажуулахад алдаа гарлаа",
        devOtpAlert: "OTP код (зөвхөн хөгжүүлэлтэд): {{code}}"
      },
      Profile: {
        passwordMismatch: "Нууц үг таарахгүй байна",
        passwordChanged: "Нууц үг амжилттай солигдлоо. Дахин нэвтэрнэ үү.",
        title: "Таны профайл",
        lastModified: "Сүүлд өөрчилсөн",
        updateSuccess: "Мэдээлэл амжилттай шинэчлэгдлээ",
        updateError: "Алдаа гарлаа",
        lastName: "Таны овог",
        firstName: "Өөрийн нэр",
        dateOfBirth: "Төрсөн огноо",
        nationality: "Иргэншил",
        gender: "Хүйс",
        genderSelect: "Сонгох",
        male: "Эрэгтэй",
        female: "Эмэгтэй",
        other: "Бусад",
        invoiceLink: "И-баримт холбох",
        individual: "Хувь хүн",
        business: "Хувь хүн /бизнес эрхлэгч/",
        organization: "Байгуулага",
        lastNamePlaceholder: "Овог",
        firstNamePlaceholder: "Нэр",
        updating: "Хадгалж байна...",
        updateButton: "Мэдээлэл шинэчлэх"
      },
      ProfilePassword: {
        title: "Нууц үг солих",
        currentPassword: "Одоогийн нууц үг",
        newPassword: "Шинэ нууц үг",
        confirmNewPassword: "Шинэ нууц үг давтах",
        passwordMismatch: "Шинэ нууц үгнүүд таарахгүй байна",
        changeSuccess: "Нууц үг амжилттай солигдлоо. Дахин нэвтэрч орно уу",
        changeError: "Алдаа гарлаа",
        changing: "Солиж байна...",
        changeButton: "Солих"
      },
      reviews: {
        title: "Сэтгэгдлүүд",
        myReviews: "Таны үлдээсэн сэтгэгдэл",
        pendingReviews: "Хүлээгдэж буй",
        noReviewsTitle: "Үлдээсэн сэтгэгдэл байхгүй",
        noReviews: "Захиалгаа дуусгаад эхний сэтгэгдлээ үлдээгээрэй!",
        noPendingTitle: "Бүгд дууссан!",
        noPendingReviews: "Үнэлгээ өгөх захиалга байхгүй байна.",
        yourRating: "Таны өгсөн үнэлгээ:",
        writeReview: "Үнэлгээ өгөх",
        rateExperience: "Та үнэлгээ өгнө үү.",
        overallRating: "Нийт үнэлгээ",
        stars: "од",
        whatDidYouLike: "Танд юу нь хамгийн их таалагдсан бэ?",
        optional: "(Заавал биш)",
        additionalComments: "Нэмэлт сэтгэгдэл",
        commentPlaceholder: "Сэтгэгдлээ бичнэ үү...",
        cleanliness: "Цэвэрлэгээ",
        location: "Байршил",
        food: "Хоол",
        service: "Үйлчилгээ",
        value: "Үнэ цэнэ",
        comment: "Сэтгэгдэл",
        submit: "Илгээх",
        submitting: "Илгээж байна...",
        delete: "Устгах",
        bookingNumber: "Захиалгын дугаар:",
        completedOn: "Биелсэн огноо:",
        date: "Огноо:",
        completed: "Биелсэн",
        totalPaid: "Нийт төлсөн",
        viewAllReviews: "Бүх сэтгэгдэл үзэх",
        reviewsCount: "{{count}} сэтгэгдэл",
        roomLabel: "Өрөө:",
        stayLabel: "Хугацаа:",
        categoryAll: "Бүгд",
        propertyTypes: {
          hotel: "Зочид буудал",
          resort: "Амралтын газар",
          camp: "Жуулчны бааз"
        }
      },
      settings: {
        title: "Тохиргоо",
        description: "Дансны тохиргоо болон сонголтоо удирдах",
        languageCurrency: "Хэл / Валют",
        language: "Хэл",
        languageDescription: "Харагдах хэлээ сонгоно уу",
        currency: "Валют",
        currencyDescription: "Үнийг харуулах валютаа сонгоно уу",
        theme: "Харагдах байдал",
        darkMode: "Харанхуй горим",
        darkModeDesc: "Нүдэнд илүү тав тухтай харанхуй загвар",
        emailSettings: "Имэйл тохиргоо",
        bookingConfirmationEmails: "Захиалга баталгаажсан имэйл",
        bookingConfirmationEmailsDesc: "Захиалга баталгаажсаны дараах и-мэйлийг идэвхгүй болгох боломжгүй.   ",
        reviewEmails: "Үнэлгээний и-мэйл",
        reviewEmailsDesc: "Таны захиалга биелж дууссаны дараа тухайн буудалд үнэлгээ өгч, сэтгэгдлээ үлдээх и-мэйл явуулах",

        pushNotifications: "Push мэдэгдэл",
        notifications: "Мэдэгдэл",
        notificationsDesc: "Чухал мэдээллийн push мэдэгдлийг идэвхжүүлэх",
        notificationReceive: "мэдэгдэл",
        notificationReceiveDesc: "Сайттай холбоотой бүхий л шинэ мэдээ, мэдээллийг мэдэгдлээр хүлээн авах",
        saved: "Хадгалагдлаа!",
        saving: "Хадгалж байна...",
        saveChanges: "Өөрчлөлт хадгалах",
        accountManagement: "Аккаунт тохиргоо",
        deleteAccount: "Бүртгэл устгах",
        deleteAccountWarning: "Манай сайт дээрх бүртгэлээ устгаснаар таны бүх мэдээлэл устгагдана.",
        confirmDelete: "Та итгэлтэй байна уу? Баталгаажуулахын тулд нууц үгээ оруулна уу:",
        passwordPlaceholder: "Нууц үгээ оруулна уу",
        deleting: "Устгаж байна...",
        deleteAccountConfirm: "Бүртгэл устгах",
        saveFailed: "Тохиргоо хадгалахад алдаа гарлаа",
        deleteFailed: "Аккаунт устгахад алдаа гарлаа",
        languages: {
          mn: "Монгол",
          en: "English",
          zh: "中文"
        },
        currencies: {
          MNT: "Монгол төгрөг",
          USD: "Америк доллар",
          EUR: "Евро",
          CNY: "Хятад юань"
        }
      },
      profileNav: {
        yourProfile: "Таны профайл",
        email: "Цахим шуудан",
        phone: "Утасны дугаар",
        changePassword: "Нууц үг солих",
        bookingHistory: "Захиалгын түүх",
        saved: "Хадгалсан",
        promoCode: "Промо код",
        reviews: "Сэтгэгдлүүд",
        settings: "Тохиргоо",
        bookHotel: "Буудал захиалах",
        personalInfo: "Хувийн мэдээлэл"
      },
      ProfileEmail: {
        title: "Цахим шуудан",
        verified: "Таны цахим шуудан баталгаажсан байна",
        notVerified: "Таны цахим шуудан баталгаажаагүй байна",
        changeEmail: "Цахим шуудан солих",
        sending: "Илгээж байна...",
        otpSent: "{{email}} хаяг руу OTP код илгээлээ. Кодоо оруулна уу",
        otpPlaceholder: "OTP код",
        verifying: "Шалгаж байна...",
        verifyButton: "Баталгаажуулах",
        verifySuccess: "Цахим шуудан амжилттай баталгаажлаа",
        verifyError: "OTP буруу эсвэл хугацаа дууссан",
        back: "Буцах",
        verifyEmail: "Имэйл баталгаажуулах",
        devOtpCode: "Хөгжүүлэлтийн OTP код",
        devOtpHint: "Энэ нь зөвхөн хөгжүүлэлтийн горимд харагдана",
        enterNewEmail: "Шинэ имэйл хаягаа оруулна уу",
        newEmailPlaceholder: "example@email.com",
        sendCode: "Код илгээх",
        changeSuccess: "Цахим шуудан амжилттай солигдлоо"
      },
      dashboard: {
        welcomeBack: "Тавтай морилно уу, {{name}}",
        subtitle: "Захиалгаа удирдаж, шинэ очих газруудыг нээгээрэй",
        emailNotVerified: "Таны имэйл баталгаажаагүй байна",
        totalBookings: "Нийт захиалга",
        destinationsVisited: "Очсон газрууд",
        upcomingTrips: "Удахгүй аяллууд",
        totalSpent: "Нийт зарцуулсан",
        vsLastMonth: "өмнөх сартай харьцуулахад",
        bookingHistory: "Захиалгын түүх",
        loadingBookings: "Захиалга ачааллаж байна...",
        noBookings: "Захиалга олдсонгүй",
        total: "Нийт",
        viewAllBookings: "Бүх захиалгуудыг харах",
        all: "Бүгд",
        confirmed: "Баталгаажсан",
        finished: "Дуусгасан",
        canceled: "Цуцалсан",
        quickActions: "Хурдан үйлдэлүүд",
        shortcutsToTasks: "Нийтлэг үүрэгт товчлол",
        newSearch: "Шинэ хайлт",
        findNextDestination: "Дараагийн очих газраа олоорой",
        manageBookings: "Захиалга шалгах",
        viewModify: "Захиалга харах & өөрчлөх",
        savedHotels: "Хадгалсан зочид буудлууд",
        favoriteProperties: "Таны дуртай зочид буудлууд",
        paymentMethods: "Төлбөрийн хэрэгсэл",
        manageCards: "Картаа удирдах",
        notifications: "Мэдэгдэл",
        stayUpdated: "Мэдээллэлтэй байгаарай",
        support: "Дэмжлэг",
        customerService: "24/7 хэрэглэгчийн үйлчилгээ",
        rewards: "Урамшуулал",
        earnPoints: "Оноо хуримтлуулах",
        settings: "Тохиргоо",
        accountPreferences: "Дансны тохиргоо",
        upcomingTripsTitle: "Удахгүй аяллууд",
        trip: "Аялал",
        trips: "Аялалууд",
        noUpcomingTrips: "Удахгүй аялал байхгүй байна",
        browseHotels: "Зочид буудал харах",
        viewDetails: "Дэлгэрэнгүй харах",
        loading: "Уншиж байна...",
        checkIn: "Орох",
        checkOut: "Гарах",
        guests: "Зочид",
        room: "Өрөө",
        reviewed: "Үнэлгээ өгсөн",
        verifyNow: "Баталгаажуулах",
        emailVerification: "Имэйл баталгаажуулалт",
        sendingCode: "Код илгээж байна...",
        sendCodeTo: "Баталгаажуулах код илгээх имэйл",
        sendCode: "Баталгаажуулах код илгээх",
        enterCode: "Дараах имэйл рүү илгээсэн 6 оронтой кодоо оруулна уу",
        codeExpires: "Код {{minutes}} минутын дотор хүчинтэй",
        verifyButton: "Имэйл баталгаажуулах",
        verifying: "Баталгаажуулж байна...",
        resendCode: "Код дахин илгээх",
        emailVerified: "Имэйл амжилттай баталгаажлаа!",
        close: "Хаах"
      },
      saved: {
        title: "Хадгалсан зочид буудлууд",
        hotelsCount: "зочид буудал хадгалсан",
        loading: "Хадгалсан зочид буудлуудыг ачааллаж байна...",
        remove: "Хадгалсанаас хасах",
        addedOn: "Нэмсэн огноо",
        empty: {
          title: "Одоогоор хадгалсан зочид буудал байхгүй байна",
          description: "Судлаж эхэлж, дуртай зочид буудлуудаа хадгалаарай!",
          browseHotels: "Зочид буудал харах"
        }
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
        freeCancellationUntil: "{{date}}-нээс өмнө цуцлах боломжтой.",
        onlyRoomsLeft: "Сүүлийн {{count}} өрөө үлдлээ.",
        amenities: "Тохижилт",
        reviews: "Сэтгэгдэл",
        reviewsSection: {
          noReviews: "Үнэлгээ хараахан байхгүй байна",
          beFirst: "Туршлагаа анхны хүн болж хуваалцаарай!",
          showLess: "Цөөнийг харах",
          showAll: "Бүх {{count}} үнэлгээг харах",
          ratingBreakdownPlaceholder: "Үнэлгээний задаргаа нь үнэлгээний мэдээлэл нэгтгэгдсэний дараа харагдах болно"
        },
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
        recentlyViewed: "Сүүлд үзсэн",
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
        noResults: "Шүүлтүүрт тохирох хайлт олдсонгүй",
        noResultsMessage: "Шүүлтүүрийг цэвэрлээд, өөрөөр хайгаад үзэх үү?",
        hotelFound: "зочид буудал олдлоо",
        hotelsFound: "зочид буудал олдлоо",
        forYourSearch: "таны хайлтаар",
        searchingIn: "Хайж байна",
        perNight: "шөнөд",
        perRoom: "өрөөнд",
        roomsAvailable: "өрөө боломжтой",
        showOnMap: "Газрын зураг дээр харах",
        priceUnavailable: "Үнэ тодорхойгүй",
        description: {
          variety: "Олон төрлийн тохижилт бүхий зочид буудал.",
          luxury: "Шилдэг үйлчилгээ, тансаг орчин."
        },
        overview: "Ерөнхий",
        houseRules: "Дотоод журам",
        faq: "Түгээмэл асуулт",
        priceFrom: "Эхлэх үнэ",
        goldTierDeal: "Хямдарсан",
        noAmenities: "Мэдээлэл байхгүй байна",
        viewOnMap: "Газрын зураг дээр харах",
        others: "Бусад",
        allFacilities: "Бүх тохижилт",
        surroundings: "Ойр орчмын газрууд",
        transport: "Тээвэр",
        landmarks: "Үзэсгэлэнт газрууд",
        dining: "Хоол, ресторан",
        shopping: "Худалдаа",
        open_in_google_maps: "Google Maps-д нээх",
        no_nearby_places: "Ойр орчмын газар олдсонгүй",
        viewPhotos: "Зургуудыг харах"
      },
      search: {
        locationPlaceholder: "Хаашаа явах вэ?",
        selectLocation: "Очих газраа сонгоно уу",
        property: "Зочид буудал",
        hotelsCount: "{{count}} буудал",
        popularLocations: "Алдартай байршлууд",
        popularDestination: "Алдартай байршлууд",
        searchResults: "Хайлтын үр дүн",
        checkIn: "Ирэх өдөр",
        checkOut: "Явах өдөр",
        guest: "Зочин",
        guests: "Зочид",
        adults: "Том хүн",
        children: "Хүүхэд",
        rooms: "Өрөө",
        searchButton: "Хайх",
        errors: {
          invalidCheckoutDate: "Гарах өдөр орох өдрөөс хойш байх ёстой"
        },
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
        adultsAgeNote: "18-аас дээш нас",
        childrenAgeNote: "0-17 нас",
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
        searchByNamePlaceholder: "Буудлын нэрээр хайх",
        pagination: {
          resultsText: "{{start}}-{{end}} нийт {{total}} буудлын үр дүн",
          previous: "Өмнөх",
          next: "Дараах"
        },
        activeFilters: "Сонгосон шүүлтүүр",
        clearAll: "Бүгдийг арилгах",
        discountedPrice: "Хямдралтай үнэ",
        simpleSearch: "Энгийн хайлт",
        chipGroupCount: "{{groupLabel}} · {{count}}",
        applyFiltersWithCount: "Хэрэглэх ({{count}} буудал)",
        filtersShort: "Шүүлт",
        starCount: "{{count}} од",
        chipGroups: {
          propertyType: "Буудлын төрөл",
          starRating: "Одны үнэлгээ",
          roomFeatures: "Үндсэн үйлчилгээ",
          generalServices: "Үйлчилгээ",
          outdoorAreas: "Гадна байгууламж",
          accessibility: "Хүртээмж",
          bedType: "Орны төрөл",
          district: "Дүүрэг",
          landmark: "Байршил"
        },
        filtersSection: {
          title: "Шүүлтүүр",
          usedByYou: "Сүүлд хайсан шүүлтүүр",
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
          budget: "Төсөв",
          hotelStarRating: "Буудлын зэрэглэл",
          roomFeatures: "Өрөөний онцлог зүйлс",
          generalServices: "Ерөнхий үйлчилгээ",
          generalFacilities: "Ерөнхий байгууламж",
          additionalFacilities: "Нэмэлт байгууламж",
          activities: "Нэмэлт төлбөртэй үйлчилгээ",
          accessibility: "Хүртээмжитэй өрөө",
          neighbourhood: "Хороолол",
          landmarks: "Гол газрууд",
          guestRating: "Зочдын үнэлгээ",
          hotelStars: "Буудлын зэрэглэл",
          outdoorArea: "Нэмэлт байгууламж",
          bedType: "Орны төрөл",
          popularPlaces: "Алдартай газрууд",
          discounted: "Хямдралтай",
          clearAll: "Бүгдийг арилгах",
          starsPlus: "{{rating}}+ од"
        },
        transliterationMatches: "Транслитерацийн тохирлыг багтаасан"
      },
      datePicker: {
        month: "Сар",
        day: "Өдөр",
        year: "Он"
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
          title: "Захиалга шалгах",
          subtitle: "Захиалгын хуудас дээрх захиалгын дугаар болон пинкодоор нэвтэрч орно уу.",
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
      bookingFlow: {
        stepRoom: "Өрөө\nсонгох",
        stepGuest: "Захиалагчийн\nмэдээлэл",
        stepPayment: "Төлбөр\nбаталгаажуулах",
        guestInfoTitle: "Захиалагчийн мэдээлэл",
        placeholderLastName: "Та овгоо оруулна уу",
        placeholderFirstName: "Та нэрээ оруулна уу",
        placeholderEmail: "И-мэйл хаягаа оруулна уу",
        placeholderPhone: "Утасны дугаараа оруулна уу",
        LastNameLabel: "Таны овог",
        FirstNameLabel: "Таны нэр",
        EmailLabel: "И-мэйл хаяг",
        PhoneLabel: "Утасны дугаар",
        ebarimtTitle: "И-Баримт",
        ebarimtAlt: "И-Баримт",
        ebarimtToggleDecline: "Авахгүй",
        ebarimtToggleAccept: "Авна",
        ebarimtIndividual: "Хувь хүн",
        ebarimtOrganization: "Албан байгууллага",
        ebarimtTaxpayer: "Татвар төлөгч",
        ebarimtSearch: "Хайх",
        ebarimtOrgRegister: "Байгууллагын регистрийн дугаар",
        ebarimtOrgName: "Байгууллагын нэр",
        ebarimtTaxPrefix1: "Э",
        ebarimtTaxPrefix2: "Н",
        ebarimtTaxNumber: "Регистрийн дугаар",
        ebarimtTaxName: "Татвар төлөгчийн нэр",
        ebarimtNotFound: "Бүртгэл олдсонгүй",
        ebarimtConnectionError: "Холболтын алдаа гарлаа",
        cancelPolicyAccept: "Би захиалга цуцлах нөхцлийг хүлээн зөвшөөрч байна.",
        cancelPolicyIntro: "Захиалга цуцлах тохиолдолд дараах нөхцлийн дагуу үйлчилгээний хураамжийг суутган буцаан олголт хийгдэх эсвэл цуцлах боломжгүй болохыг анхаарна уу.",
        cancelFeeTitle: "Цуцлалтын хураамж:",
        cancelNotAllowed: "Цуцлах боломжгүй",
        cancelFree: "Үнэгүй",
        noRoomPolicyInfo: "Өрөөний мэдээлэл алга",
        cancelPerHotelNote: "*Тухайн буудлын дотоод бодлогоос хамааран буудал бүрийн цуцлалтын хураамж харилцан адилгүй өөр байна.",
        cancelAllowed: "Цуцлах боломжтой",
        bookingSummary: "Захиалгын мэдээлэл",
        selectedRooms: "Таны сонгосон өрөө:",
        roomCount: "{{count}} өрөө",
        promoPlaceholder: "Промо кодоо оруулна уу.",
        promoInvalid: "Энэ промо код хүчингүй байна.",
        acceptTerms: "Үйлчилгээний нөхцөл зөвшөөрөх",
        confirmBooking: "Төлбөр төлөх",
        bookingInProgress: "Уншиж байна...",
        validation: {
          nameRequired: "Нэр оруулна уу",
          emailRequired: "И-мэйл хаяг оруулна уу",
          emailInvalid: "И-мэйл хаяг буруу байна",
          phoneRequired: "Утасны дугаар оруулна уу",
          phoneInvalid: "Утасны дугаар буруу байна",
          cancellationRequired: "Захиалга цуцлах нөхцлийг зөвшөөрнө үү",
          tosRequired: "Үйлчилгээний нөхцөлийг зөвшөөрнө үү",
        },
        mismatchTitle: "Таны захиалгын мэдээлэл",
        mismatchSearch: "Таны хайлт",
        mismatchSelected: "Сонгосон өрөө",
        mismatchCapacity: "Сонгосон өрөөний багтаамж",
        mismatchGuests: "{{rooms}} өрөө, {{adults}} том хүн{{children}}",
        mismatchChildrenSuffix: ", {{count}} хүүхэд",
        mismatchWarning: "Таны хайлтын мэдээлэл сонгосон өрөөтэй таарахгүй байна. Өрөө сонгох хуудас руу буцаж өрөө эсвэл зочдын тоогоо дахин шалгана уу.",
        mismatchBack: "Өрөө сонгох хуудас руу буцах",
        multiRoomTitle: "2+ өрөөний цуцлалтын нөхцөл",
        multiRoomAllExpired: "Цуцлах боломжгүй — бүх хугацаа өнгөрсөн байна.",
        multiRoomNote: "*Тухайн буудлын бодлогоос хамааран цуцлалтын хураамж өөр байж болно.",
        tosTitle: "Үйлчилгээний нөхцөл",
        tosScrollHint: "Доош гүйлгэж бүх нөхцөлтэй танилцана уу.",
        tosScrolledOk: "✓ Та нөхцөлтэй танилцлаа",
        tosScrollContinue: "Үргэлжлүүлэхийн тулд доош гүйлгэнэ үү...",
        cancel: "Цуцлах",
        continue: "Үргэлжлүүлэх",
        tosAccept: "Зөвшөөрөх",
        checkInTime: "Орох цаг",
        checkOutTime: "Гарах цаг",
        nights: "{{count}} шөнө",
        totalDue: "Нийт төлөх дүн",
        guestCapacity: "Орох боломжтой хүний тоо :",
        weekdays: ["Ня", "Да", "Мя", "Лха", "Пү", "Ба", "Бя"],
        ebarimtTaxpayerPerson: "Татвар төлөгч иргэн",
        registerNumberLabel: "Регистрийн дугаар",
        orgNameLabel: "Байгууллагын нэр",
        searching: "Хайж байна...",
        basePrice: "Үндсэн үнэ",
        vatIncluded: "*НӨАТ багтсан үнэ",
        applyPromo: "Ашиглах",
        beforeDeadline: "Өмнөх өдрийн {{deadline}}-ээс өмнө:",
        afterDeadline: "Өмнөх өдрийн {{deadline}}-ээс хойш:",
        mismatchGuestMismatchTitle: "Зочдын тоо таарахгүй байна",
        mismatchUnderstand: "Ойлголоо, үргэлжлүүлэх",
        back: "Буцах",
        multiRoomBeforeCancel: "{{date}}-с өмнө цуцалбал:"
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
        clearFilters: "Тэгье, цэвэрлэе",
        categories: {
          budget: "Хямд",
          midRange: "Дунд зэрэглэл",
          luxury: "Тансаг зэрэглэл",
          familyFriendly: "Гэр бүлд зориулсан",
          business: "Бизнес"
        },
        popular: {
          breakfast: "Өглөөний хоол",
          romantic: "Романтик",
          fiveStar: "5 од",
          airportTransport: "Онгоцны буудлын тээвэр",
          wifiIncluded: "Wi-Fi багтсан"
        },
        bedTypes: {
          single: "Ганц ор (90×200 см)",
          twin: "Хос ор (2×90×200 см)",
          double: "Давхар ор (140×200 см)",
          queen: "Хатан ор (160×200 см)",
          king: "Хаан ор (180×200 см)"
        },
        places: {
          center: "Төв хэсэг",
          airport: "Онгоцны буудлын ойр",
          shopping: "Худалдааны төв",
          attractions: "Аялалын газрын ойр",
          transport: "Тээврийн зангилаа"
        }
      },
      faq: {
        title: "Түгээмэл асуултууд",
        subtitle: "Түгээмэл асуугддаг асуултууд",
        showMore: "Дэлгэрэнгүй харах",
        showLess: "Хураангуйлах",
        noAnswer: "Энэ асуултын хариу одоогоор бэлэн байхгүй байна.",
        q1: { 
          q: "Бүртгэл үүсгэхгүйгээр шууд өрөө захиалах боломжтой юу?", 
          a: "Тийм. Та өөрийн хүссэн өрөөгөө шууд сонгож захиалгаа баталгаажуулахад хангалттай. Харин таны мэдээлэл буруу, зөрсөн нөхцөлд бид хариуцлага хүлээхгүй тул та өөрийн мэдээллээ үнэн зөв бөглөж, захиалгаа хийгээрэй." 
        },
        q2: { 
          q: "Танай платформоор зарж буй өрөөний үнэ дээр ямар нэг нэмэлт төлбөр нэмэгддэг үү?", 
          a: "Үгүй. Түнш буудлын ил тод үнийг харуулна — захиалгын нууц нэмэлт шимтгэл нэмэгддэггүй." 
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
        title: "Яагаад MyRoom вэ?",
        whyChooseUs: "Яагаад MyRoom вэ?",
        whyChooseUsDesc: "Монгол даяар зочид буудал захиалах итгэмжлэх платформ",
        wideSelection: "Хялбар хайлт",
        wideSelectionDesc: "Монгол даяарх олон зочид буудлаас хэдхэн секундэд тохирох өрөөгөө олоорой.",
        instantConfirmation: "Шууд баталгаажилт",
        instantConfirmationDesc: "Төлбөр төлсний дараа захиалга шууд баталгаажна — давхар захиалгын эрсдэлгүй.",
        fastService: "Ил тод үнэ",
        fastServiceDesc: "Түнш буудлын үнэ, нууц нэмэлт шимтгэлгүй — харагдаж буй үнээрээ захиална."
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
        onlyRoomsLeft: "Зөвхөн {{count}} үлдлээ!",
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
        more: "бусад",
        cancellationPolicy: "Цуцлалтын бодлого",
        beforeCancelLabel: "Өмнөх өдрийн {{time}} цагаас өмнө",
        afterCancelLabel: "Өмнөх өдрийн {{time}} цагаас хойш",
        freeCancelShort: "үнэгүй"
      },
      hotelRooms: {
        availableRooms: "Боломжтой өрөөнүүд",
        checkInDate: "Орох огноо",
        checkOutDate: "Гарах огноо",
        pricesPerNight: "Үнэ нь нэг шөнөөр тооцогдоно",
        noRoomsAvailable: "Таны сонгосон өдөр бүх өрөө дүүрсэн байна",
        loaded: "Ачааллагдсан",
        roomsLoaded: "өрөө(нүүд), гэхдээ хэн нь боломжит шалгуурыг хангахгүй байна.",
        tryDifferentDates: "Та өдрөө сольж үзээрэй",
        totalPrice: "Нийт үнэ",
        bookRoom: "Өрөө захиалах",
        numberOfRooms: "Өрөөний тоо"
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
        from: "эхлэх үнэ"
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
        similarHotels: "Төстэй зочид буудлууд",
        roomsAvailable: "{{count}}+ өрөө боломжтой",
        roomsRemaining: "{{count}} өрөө үлдсэн",
        premiumClass: "Дээд зэрэглэлийн зочид буудал",
        locationUnknown: "Байршил тодорхойгүй",
        priceFrom: "-с",
        startingPrice: "Эхлэх үнэ",
        night: "шөнө",
        book: "Захиалах",
        viewOnMap: "Газрын зураг дээр харах",
        exceptional: "Гайхалтай",
        highlyRated: "Зочдоос өндөр үнэлгээ авсан",
        wouldRecommend: "санал болгох",
        breakfast: "Өглөөний цай",
        foodDining: "Хоол, хүнсний үйлчилгээ",
        locationInfo: "Байршлын мэдээлэл",
        provinceCity: "Хот/Аймаг",
        soumDistrict: "Дүүрэг/Сум",
        totalFloors: "Давхрын тоо",
        propertyHighlights: "Буудлын онцлог",
        inCityCenter: "",
        center: "төвд",
        totalRooms: "Нийт өрөө",
        operatingSince: "Үйл ажиллагаа эхэлсэн",
        photos: "зураг",
        surroundings: "Ойр орчимд",
        showAll: "Дэлгэрэнгүй харах",
        airportTransfer: "Нисэх онгоцны буудлын трансфер",
        frontDesk24h: "24 цагийн хүлээн авалт",
        partOfGroup: "Сүлжээний нэг хэсэг",
        guestRating: "Зочдын үнэлгээ",
        noRatingsYet: "Үнэлгээ байхгүй"
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
        manageBooking: "Захиалга шалгах",
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
        enteringGuests: "Орох хүний тоо",
        roomCapacityGuests: "Орох боломжтой хүний тоо :",
        totalPaidAmount: "Нийт төлсөн дүн",
        guestName: "Захиалагч",
        bookingDateLabel: "Захиалсан огноо",
        bookingNumber: "Захиалгын №",
        pinCodeLabel: "PIN код",
        bookingNumberCol: "Захиалгын №",
        roomTypeCol: "Өрөөний нэр",
        extraDescCol: "Нэмэлт тайлбар",
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
        backHome: "Буцах",
        checkIn: "Орох",
        checkOut: "Гарах",
        night: "шөнө",
        nights: "шөнө",
        noRoomsSelected: "Өрөө сонгогдоогүй байна",
        quantity: "Тоо",
        increaseQuantity: "Тоо нэмэх",
        maxRoomsAvailable: "Хамгийн их {{count}} өрөө боломжтой",
        totalRooms: "Нийт өрөөнүүд",
        room: "өрөө",
        rooms: "өрөөнүүд",
        bookRoom: "Өрөө захиалах",
        duration: "Хугацаа",
        manageBookingTitle: "Захиалга удирдах",
        changeDate: "Өдөр өөрчлөх",
        changeRoom: "Өрөө солих",
        addRoom: "Өрөө нэмэх",
        cancelBookingAction: "Захиалга цуцлах",
        contactHotelTitle: "Буудалтай холбоо барих",
        hotelLocationMap: "Буудлын байршил",
        invoiceTypeTitle: "Нэхэмжлэлийг хэн дээр гаргах вэ?",
        invoiceIndividual: "Хувь хүн",
        invoiceCompany: "Байгууллага"
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
      },
      payment: {
        timerExpired: "Захиалгын хугацаа дууссан. Шинэ захиалга хийнэ үү.",
        timerWarning: "Та цаг дуусахаас өмнө захиалгаа баталгаажуулна уу.",
        cancelBooking: "Захиалга цуцлах",
        downloadInvoice: "Нэхэмжлэл татах",
        selectMethod: "Төлбөрийн төрлөө сонгоно уу.",
        methods: {
          bankApp: "Банкны апп / QR",
          transfer: "Дансаар шилжүүлэх",
          wallet: "Цахим хэтэвчээр",
          card: "Картаар төлөх"
        },
        checking: "Шалгаж байна...",
        checkPayment: "Төлбөр шалгах",
        notPaid: "Төлбөр төлөгдөөгүй байна.",
        checkError: "Шалгахад алдаа гарлаа. Дахин оролдоно уу.",
        qpayError: "QPay нэхэмжлэл үүсгэхэд алдаа гарлаа",
        noteTitle: "Санамж",
        noteTransferRef: "Та төлбөр шилжүүлэхдээ гүйлгээний утгыг үнэн зөв бичиж шилжүүлнэ үү.",
        noteTransferAmount: "Төлбөрийг дутуу шилжүүлсэн эсвэл гүйлгээний утга зөрсөн тохиолдолд захиалга баталгаажихгүй анхаарна уу.",
        bookingSummary: "Захиалгын мэдээлэл",
        checkInTime: "Орох цаг",
        checkOutTime: "Гарах цаг",
        nights: "{{count}} шөнө",
        selectedRooms: "Таны сонгосон өрөө:",
        basePrice: "Үндсэн үнэ",
        totalDue: "Нийт төлөх дүн",
        guestInfo: "Зочны мэдээлэл",
        comingSoon: "Тун удахгүй",
        copy: "Хуулах",
        copied: "Хуулсан",
        accountNumber: "Дансны дугаар",
        accountName: "Дансны нэр",
        bank: "Банк",
        transactionRef: "Гүйлгээний утга",
        weekdays: ["Ня", "Да", "Мя", "Лха", "Пү", "Ба", "Бя"],
        banks: {
          tdb: "Худалдаа хөгжлийн банк",
          khan: "ХААН БАНК"
        },
        accountHolder: "Мая Хотелс ХХК",
        coupon: "Купон",
        guestFullName: "Овог нэр:",
        guestPhone: "Холбогдох утас:",
        guestEmail: "И-мэйл хаяг:",
        roomCount: "{{count}} өрөө",
        guestCapacity: "Орох боломжтой хүний тоо:",
        qpayCreating: "QPay нэхэмжлэл үүсгэж байна...",
        qpayScan: "QPay QR унших",
        receivingAccount: "Хүлээн авах данс",
        recipientName: "Хүлээн авагчийн нэр",
        transferAmount: "Шилжүүлэх дүн",
        qrCode: "QR код",
        scanQrShort: "QR унших",
        comingSoonDesc: "Энэ төлбөрийн сонголт удахгүй нэмэгдэнэ. Дансаар шилжүүлэх эсвэл банкны аппыг ашиглана уу.",
        bookingDescription: "Захиалга #{{code}} - {{hotel}}"
      },
      profileBookings: {
        title: "Захиалгын түүх",
        error: "Алдаа гарлаа.",
        empty: "Захиалга олдсонгүй.",
        bookingNumber: "Захиалгын дугаар:",
        date: "Огноо:",
        nights: "{{count}} шөнө",
        details: "Дэлгэрэнгүй",
        payNow: "Төлбөр төлөх",
        leaveReview: "Үнэлгээ өгөх",
        cancel: "Цуцлах",
        cancelTitle: "Захиалга цуцлах",
        pinCode: "PIN код",
        cancelBtn: "Болих",
        cancelling: "Цуцалж байна...",
        filters: {
          all: "Бүгд",
          pending: "Төлбөр хүлээгдэж буй",
          confirmed: "Баталгаажсан",
          completed: "Биелсэн",
          cancelled: "Цуцлагдсан"
        },
        cancelPinHint: "Захиалга {{code}}-г цуцлахын тулд pin кодоо оруулна уу.",
        delete: "Устгах",
        deleteComingSoon: "Удахгүй",
        deleteTitle: "Захиалга устгах",
        deleteHint: "Захиалга {{code}} таны түүхээс бүрмөсөн устгагдана. Үүнийг буцаах боломжгүй.",
        deleting: "Устгаж байна...",
        reorder: "Дахин захиалах",
        paymentTimeLeft: "Төлбөр төлөх {{time}} үлдсэн"
      },
      profilePhone: {
        title: "Утасны дугаар",
        invalidNumber: "Утасны дугаар буруу байна.",
        error: "Алдаа гарлаа.",
        invalidOtp: "OTP буруу байна.",
        verified: "Таны утасны дугаар баталгаажсан байна.",
        notverified: "Таны утасны дугаар баталгаажаагүй байна.",
        verifyPhone: "Дугаар баталгаажуулах",
        verifySuccess: "Утасны дугаар амжилттай баталгаажлаа.",
        changeSuccess: "Утасны дугаар амжилттай солигдлоо.",
        changePhone: "Дугаар солих",
        enterNewPhone: "Та солих утасны дугаараа оруулна уу.",
        sending: "Илгээж байна...",
        getCode: "Баталгаажуулах код авах",
        otpHint: "Таны дугаар луу илгээсэн кодыг оруулж баталгаажуулна уу.",
        verifying: "Шалгаж байна...",
        verify: "Баталгаажуулах",
        resend: "Дахин илгээх"
      },
      profileSaved: {
        title: "Хадгалсан",
        all: "Бүгд ({{count}})",
        empty: "Хадгалсан буудал байхгүй байна",
        searchHotels: "Буудал хайх",
        remove: "Хадгалсанаас хасах",
        reviews: "{{count}} сэтгэгдэл",
        pricePerNight: "1 шөнийн үнэ (НӨАТ багтсан)"
      },
      profilePromo: {
        title: "Промо код",
        error: "Алдаа гарлаа.",
        added: "\"{{code}}\" промо код нэмэгдлээ.",
        placeholder: "Промо код оруулах",
        adding: "Нэмж байна...",
        add: "Нэмэх",
        tabs: {
          active: "Идэвхтэй",
          used: "Ашигласан",
          inactive: "Идэвхгүй"
        },
        emptyActive: "Идэвхтэй промо код байхгүй",
        emptyUsed: "Ашигласан промо код байхгүй",
        emptyInactive: "Идэвхгүй промо код байхгүй",
        table: {
          discount: "Хөнгөлтийн хувь",
          validPeriod: "Хүчинтэй хугацаа",
          status: "Төлөв",
          code: "Код",
          promoCode: "Промо код",
          discountPercent: "Хөнгөлтийн хувь",
          discountAmount: "Хөнгөлтийн хувь / дүн",
          availableCount: "Ашиглах боломжтой тоо",
          usedCount: "Ашигласан тоо",
          usedDate: "Ашигласан огноо"
        },
        expired: "— (дууссан)"
      },
      backendErrors: {
        emailExists: "Энэ и-мэйл хаяг бүртгэлтэй байна",
        phoneExists: "Энэ утасны дугаар бүртгэлтэй байна"
      }
    }
  },
  zh: {
    translation: {
      common: {
        loading: "加载中...",
        error: "错误",
        cancel: "取消",
        confirm: "确认",
        save: "保存",
        back: "返回",
        close: "关闭"
      },
      hero: {
        flipPhrases: [
          "轻松预订客房",
          "即时确认",
          "价格透明",
          "覆盖蒙古全国",
          "一站式预订"
        ]
      },
      features: {
        title: "为什么选择 MyRoom？",
        wideSelection: "轻松搜索",
        wideSelectionDesc: "几秒钟内找到蒙古各地的合适客房。",
        instantConfirmation: "即时确认",
        instantConfirmationDesc: "付款完成后立即确认预订，避免重复预订。",
        fastService: "价格透明",
        fastServiceDesc: "合作伙伴价格，无隐藏预订费用。"
      },
      home: {
        popularDestinationsTitle: "热门目的地",
        popularDestinationsSubtitle: "探索旅客喜爱的城市"
      },
      partnerships: {
        title: "合作伙伴"
      },
      faq: {
        title: "常见问题",
        showMore: "查看更多",
        showLess: "收起",
        noAnswer: "此问题暂无答案。"
      },
      hotel: {
        recentlyViewed: "最近浏览",
        recommended: "推荐酒店",
        recommendedFilters: {
          popular: "热门",
          discounted: "优惠",
          highlyRated: "高评分",
          cheapest: "最低价",
          newlyAdded: "新上线"
        }
      },
      settings: {
        title: "设置",
        description: "管理您的账户偏好和设置",
        languageCurrency: "语言 / 货币",
        language: "语言",
        languageDescription: "选择您偏好的显示语言",
        currency: "货币",
        currencyDescription: "选择价格显示货币",
        emailNotifications: "邮件通知",
        bookingConfirmationEmails: "预订确认邮件",
        bookingConfirmationEmailsDesc: "接收预订确认邮件",
        reviewEmails: "评价邮件",
        reviewEmailsDesc: "预订完成后向酒店发送评价邮件，以便评分和留下反馈",

        notificationReceive: "通知",
        notificationReceiveDesc: "通过通知接收所有与网站相关的最新动态和消息",
        saved: "已保存！",
        saving: "保存中...",
        saveChanges: "保存更改",
        accountManagement: "账户管理",
        deleteAccount: "删除账户",
        deleteAccountWarning: "删除您在我们网站上的注册账户将会清除您的所有信息。",
        confirmDelete: "您确定吗？请输入密码确认：",
        passwordPlaceholder: "请输入密码",
        deleting: "删除中...",
        deleteAccountConfirm: "删除我的账户",
        languages: { mn: "蒙古语", en: "英语", zh: "中文" },
        currencies: { MNT: "蒙古图格里克", USD: "美元", EUR: "欧元", CNY: "人民币" }
      },
      profileNav: {
        yourProfile: "您的资料",
        email: "电子邮箱",
        phone: "电话号码",
        changePassword: "修改密码",
        bookingHistory: "预订记录",
        saved: "收藏",
        promoCode: "优惠码",
        reviews: "评价",
        settings: "设置",
        bookHotel: "预订酒店",
        personalInfo: "个人信息"
      },
      payment: {
        timerExpired: "预订时间已过期，请重新预订。",
        timerWarning: "请在倒计时结束前确认您的预订。",
        cancelBooking: "取消预订",
        downloadInvoice: "下载发票",
        selectMethod: "请选择支付方式。",
        methods: {
          bankApp: "银行应用 / 二维码",
          transfer: "银行转账",
          wallet: "电子钱包",
          card: "银行卡支付"
        },
        checking: "正在查询...",
        checkPayment: "查询付款",
        notPaid: "尚未收到付款。",
        checkError: "无法验证付款，请重试。",
        qpayError: "创建 QPay 账单失败。",
        noteTitle: "提示",
        noteTransferRef: "转账时请填写正确的交易备注。",
        noteTransferAmount: "金额不足或备注不符可能导致预订无法确认。",
        bookingSummary: "预订信息",
        checkInTime: "入住",
        checkOutTime: "退房",
        nights: "{{count}} 晚",
        selectedRooms: "您选择的房间：",
        basePrice: "基础价格",
        totalDue: "应付总额",
        guestInfo: "客人信息",
        comingSoon: "即将推出",
        copy: "复制",
        copied: "已复制",
        accountNumber: "账号",
        accountName: "账户名称",
        bank: "银行",
        transactionRef: "交易备注",
        weekdays: ["日", "一", "二", "三", "四", "五", "六"],
        banks: { tdb: "蒙古贸易发展银行", khan: "蒙古 Khan 银行" },
        accountHolder: "Maya Hotels LLC"
      },
      profileBookings: {
        title: "预订记录",
        error: "发生错误。",
        empty: "未找到预订。",
        bookingNumber: "预订号：",
        date: "日期：",
        nights: "{{count}} 晚",
        details: "详情",
        payNow: "继续付款",
        leaveReview: "撰写评价",
        cancel: "取消",
        cancelTitle: "取消预订",
        pinCode: "PIN 码",
        cancelBtn: "取消",
        cancelling: "正在取消...",
        filters: {
          all: "全部",
          pending: "待付款",
          confirmed: "已确认",
          completed: "已完成",
          cancelled: "已取消"
        },
        cancelPinHint: "请输入 PIN 以取消预订 {{code}}。",
        delete: "删除",
        deleteComingSoon: "即将推出",
        deleteTitle: "删除预订",
        deleteHint: "预订 {{code}} 将从您的历史记录中永久删除。此操作无法撤销。",
        deleting: "正在删除...",
        reorder: "再次预订",
        paymentTimeLeft: "付款剩余 {{time}}"
      },
      profilePhone: {
        title: "电话号码",
        invalidNumber: "电话号码无效。",
        error: "发生错误。",
        invalidOtp: "验证码无效。",
        verified: "您的电话号码已验证。",
        notverified: "您的电话号码尚未验证。",
        verifyPhone: "验证号码",
        verifySuccess: "电话号码验证成功。",
        changeSuccess: "电话号码更换成功。",
        changePhone: "更换号码",
        enterNewPhone: "请输入要更换的新电话号码。",
        sending: "发送中...",
        getCode: "获取验证码",
        otpHint: "请输入发送到您手机的验证码。",
        verifying: "验证中...",
        verify: "验证",
        resend: "重新发送"
      },
      profileSaved: {
        title: "收藏",
        all: "全部 ({{count}})",
        empty: "暂无收藏酒店",
        searchHotels: "搜索酒店",
        remove: "取消收藏",
        reviews: "{{count}} 条评价",
        pricePerNight: "每晚价格（含增值税）"
      },
      profilePromo: {
        title: "优惠码",
        error: "发生错误。",
        added: "已添加优惠码「{{code}}」。",
        placeholder: "输入优惠码",
        adding: "添加中...",
        add: "添加",
        tabs: { active: "有效", used: "已使用", inactive: "无效" },
        emptyActive: "暂无有效优惠码",
        emptyUsed: "暂无已使用优惠码",
        emptyInactive: "暂无无效优惠码",
        table: {
          discount: "折扣",
          validPeriod: "有效期",
          status: "状态",
          code: "代码"
        },
        expired: "—（已过期）"
      },
      AuthLogin: {
        signIn: "登录您的账户",
        emailLabel: "电子邮箱 / 电话号码",
        emailPlaceholder: "邮箱或手机号",
        passwordLabel: "密码",
        passwordPlaceholder: "请输入密码",
        forgotPassword: "忘记密码？",
        signInButton: "登录",
        signUp: "注册",
        loginFailed: "登录失败",
        orContinueWith: "或"
      },
      AuthSignup: {
        createAccount: "创建账户",
        passwordMismatch: "两次密码不一致",
        signUpButton: "注册",
        signIn: "登录"
      },
      navigation: {
        login: "登录",
        register: "注册",
        night: "晚",
        nights: "晚"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: ['mn', 'en', 'zh', 'ru'],
    fallbackLng: {
      zh: ['en', 'mn'],
      ru: ['en', 'mn'],
      default: ['mn'],
    },
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
