(function() {
    function generateAnonymousId() {
        return crypto.randomUUID();
    }

    function getAnonymousId() {
        let anonymousId = localStorage.getItem("anonymousId");
        if (!anonymousId) {
            anonymousId = generateAnonymousId();
            localStorage.setItem("anonymousId", anonymousId);
        }
        return anonymousId;
    }

    const anonymousId = getAnonymousId();
    console.log("Assigned Anonymous ID:", anonymousId);

    // ✅ Override Fetch API để đảm bảo tất cả request đều có header "X-Anonymous-User-ID"
    const originalFetch = window.fetch;
    window.fetch = function(url, options = {}) {
        // Nếu options.headers chưa được khởi tạo, tạo mới
        options.headers = new Headers(options.headers || {});

        // Nếu request chưa có header này, tự động thêm vào
        if (!options.headers.has("X-Anonymous-User-ID")) {
            options.headers.set("X-Anonymous-User-ID", anonymousId);
        }

        return originalFetch(url, options);
    };

})();