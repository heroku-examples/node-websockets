app
    .factory('Error', function ($rootScope, $filter, Toast, Modal) {
        var _this = {
            codes: {
                "-1": {
                    "status": "-1",
                    "message": "Unauthorized",
                    "key": "UNAUTHORIZED_1",
                    "description": "\"indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.\"",
                    "spec_title": "RFC7235#6.3.1",
                    "spec_href": "https://tools.ietf.org/html/rfc7235#section-3.1"
                },
                "199": {
                    "status": "199",
                    "message": "**Informational**",
                    "key": "INFORMATIONAL",
                    "description": "\"indicates an interim response for communicating connection status or request progress prior to completing the requested action and sending a final response.\" ~ [sure](http://www.urbandictionary.com/define.php?term=sure)",
                    "spec_title": "RFC7231#6.2",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.2"
                },
                "100": {
                    "status": "100",
                    "message": "Continue",
                    "key": "CONTINUE",
                    "description": "\"indicates that the initial part of a request has been received and has not yet been rejected by the server.\"",
                    "spec_title": "RFC7231#6.2.1",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.2.1"
                },
                "101": {
                    "status": "101",
                    "message": "Switching Protocols",
                    "key": "SWITCHING_PROTOCOLS",
                    "description": "\"indicates that the server understands and is willing to comply with the client's request, via the Upgrade header field, for a change in the application protocol being used on this connection.\"",
                    "spec_title": "RFC7231#6.2.2",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.2.2"
                },
                "299": {
                    "status": "299",
                    "message": "**Successful**",
                    "key": "SUCCESSFUL",
                    "description": "\"indicates that the client's request was successfully received, understood, and accepted.\" ~ [cool](https://twitter.com/DanaDanger/status/183316183494311936)",
                    "spec_title": "RFC7231#6.3",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.3"
                },
                "200": {
                    "status": "200",
                    "message": "OK",
                    "key": "OK",
                    "description": "\"indicates that the request has succeeded.\"",
                    "spec_title": "RFC7231#6.3.1",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.3.1"
                },
                "201": {
                    "status": "201",
                    "message": "Created",
                    "key": "CREATED",
                    "description": "\"indicates that the request has been fulfilled and has resulted in one or more new resources being created.\"",
                    "spec_title": "RFC7231#6.3.2",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.3.2"
                },
                "202": {
                    "status": "202",
                    "message": "Accepted",
                    "key": "ACCEPTED",
                    "description": "\"indicates that the request has been accepted for processing, but the processing has not been completed.\"",
                    "spec_title": "RFC7231#6.3.3",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.3.3"
                },
                "203": {
                    "status": "203",
                    "message": "Non-Authoritative Information",
                    "key": "NON-AUTHORITATIVE_INFORMATION",
                    "description": "\"indicates that the request was successful but the enclosed payload has been modified from that of the origin server's 200 (OK) response by a transforming proxy.\"",
                    "spec_title": "RFC7231#6.3.4",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.3.4"
                },
                "204": {
                    "status": "204",
                    "message": "No Content",
                    "key": "NO_CONTENT",
                    "description": "\"indicates that the server has successfully fulfilled the request and that there is no additional content to send in the response payload body.\"",
                    "spec_title": "RFC7231#6.3.5",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.3.5"
                },
                "205": {
                    "status": "205",
                    "message": "Reset Content",
                    "key": "RESET_CONTENT",
                    "description": "\"indicates that the server has fulfilled the request and desires that the user agent reset the \"document view\", which caused the request to be sent, to its original state as received from the origin server.\"",
                    "spec_title": "RFC7231#6.3.6",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.3.6"
                },
                "206": {
                    "status": "206",
                    "message": "Partial Content",
                    "key": "PARTIAL_CONTENT",
                    "description": "\"indicates that the server is successfully fulfilling a range request for the target resource by transferring one or more parts of the selected representation that correspond to the satisfiable ranges found in the requests's Range header field.\"",
                    "spec_title": "RFC7233#4.1",
                    "spec_href": "https://tools.ietf.org/html/rfc7233#section-4.1"
                },
                "399": {
                    "status": "399",
                    "message": "**Redirection**",
                    "key": "REDIRECTION",
                    "description": "\"indicates that further action needs to be taken by the user agent in order to fulfill the request.\" ~ [ask that dude over there](https://twitter.com/DanaDanger/status/183316183494311936)",
                    "spec_title": "RFC7231#6.4",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.4"
                },
                "300": {
                    "status": "300",
                    "message": "Multiple Choices",
                    "key": "MULTIPLE_CHOICES",
                    "description": "\"indicates that the target resource has more than one representation, each with its own more specific identifier, and information about the alternatives is being provided so that the user (or user agent) can select a preferred representation by redirecting its request to one or more of those identifiers.\"",
                    "spec_title": "RFC7231#6.4.1",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.4.1"
                },
                "301": {
                    "status": "301",
                    "message": "Moved Permanently",
                    "key": "MOVED_PERMANENTLY",
                    "description": "\"indicates that the target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the enclosed URIs.\"",
                    "spec_title": "RFC7231#6.4.2",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.4.2"
                },
                "302": {
                    "status": "302",
                    "message": "Found",
                    "key": "FOUND",
                    "description": "\"indicates that the target resource resides temporarily under a different URI.\"",
                    "spec_title": "RFC7231#6.4.3",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.4.3"
                },
                "303": {
                    "status": "303",
                    "message": "See Other",
                    "key": "SEE_OTHER",
                    "description": "\"indicates that the server is redirecting the user agent to a different resource, as indicated by a URI in the Location header field, that is intended to provide an indirect response to the original request.\"",
                    "spec_title": "RFC7231#6.4.4",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.4.4"
                },
                "304": {
                    "status": "304",
                    "message": "Not Modified",
                    "key": "NOT_MODIFIED",
                    "description": "\"indicates that a conditional GET request has been received and would have resulted in a 200 (OK) response if it were not for the fact that the condition has evaluated to false.\"",
                    "spec_title": "RFC7232#4.1",
                    "spec_href": "https://tools.ietf.org/html/rfc7232#section-4.1"
                },
                "305": {
                    "status": "305",
                    "message": "Use Proxy",
                    "key": "USE_PROXY",
                    "description": "*deprecated*",
                    "spec_title": "RFC7231#6.4.5",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.4.5"
                },
                "307": {
                    "status": "307",
                    "message": "Temporary Redirect",
                    "key": "TEMPORARY_REDIRECT",
                    "description": "\"indicates that the target resource resides temporarily under a different URI and the user agent MUST NOT change the request method if it performs an automatic redirection to that URI.\"",
                    "spec_title": "RFC7231#6.4.7",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.4.7"
                },
                "499": {
                    "status": "499",
                    "message": "**Client Error**",
                    "key": "CLIENT_ERROR",
                    "description": "\"indicates that the client seems to have erred.\" ~ [*you* fucked up](https://twitter.com/DanaDanger/status/183316183494311936)",
                    "spec_title": "RFC7231#6.5",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5"
                },
                "400": {
                    "status": "400",
                    "message": "Bad Request",
                    "key": "BAD_REQUEST",
                    "description": "\"indicates that the server cannot or will not process the request because the received syntax is invalid, nonsensical, or exceeds some limitation on what the server is willing to process.\"",
                    "spec_title": "RFC7231#6.5.1",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.1"
                },
                "401": {
                    "status": "401",
                    "message": "Unauthorized",
                    "key": "UNAUTHORIZED_2",
                    "description": "\"indicates that the request has not been applied because it lacks valid authentication credentials for the target resource.\"",
                    "spec_title": "RFC7235#6.3.1",
                    "spec_href": "https://tools.ietf.org/html/rfc7235#section-3.1"
                },
                "402": {
                    "status": "402",
                    "message": "Payment Required",
                    "key": "PAYMENT_REQUIRED",
                    "description": "*reserved*",
                    "spec_title": "RFC7231#6.5.2",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.2"
                },
                "403": {
                    "status": "403",
                    "message": "Forbidden",
                    "key": "FORBIDDEN",
                    "description": "\"indicates that the server understood the request but refuses to authorize it.\"",
                    "spec_title": "RFC7231#6.5.3",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.3"
                },
                "404": {
                    "status": "404",
                    "message": "Not Found",
                    "key": "NOT_FOUND",
                    "description": "\"indicates that the origin server did not find a current representation for the target resource or is not willing to disclose that one exists.\"",
                    "spec_title": "RFC7231#6.5.4",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.4"
                },
                "405": {
                    "status": "405",
                    "message": "Method Not Allowed",
                    "key": "METHOD_NOT_ALLOWED",
                    "description": "\"indicates that the method specified in the request-line is known by the origin server but not supported by the target resource.\"",
                    "spec_title": "RFC7231#6.5.5",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.5"
                },
                "406": {
                    "status": "406",
                    "message": "Not Acceptable",
                    "key": "NOT_ACCEPTABLE",
                    "description": "\"indicates that the target resource does not have a current representation that would be acceptable to the user agent, according to the proactive negotiation header fields received in the request, and the server is unwilling to supply a default representation.\"",
                    "spec_title": "RFC7231#6.5.6",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.6"
                },
                "407": {
                    "status": "407",
                    "message": "Proxy Authentication Required",
                    "key": "PROXY_AUTHENTICATION_REQUIRED",
                    "description": "\"is similar to 401 (Unauthorized), but indicates that the client needs to authenticate itself in order to use a proxy.\"",
                    "spec_title": "RFC7235#3.2",
                    "spec_href": "https://tools.ietf.org/html/rfc7235#section-3.2"
                },
                "408": {
                    "status": "408",
                    "message": "Request Timeout",
                    "key": "REQUEST_TIMEOUT",
                    "description": "\"indicates that the server did not receive a complete request message within the time that it was prepared to wait.\"",
                    "spec_title": "RFC7231#6.5.7",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.7"
                },
                "409": {
                    "status": "409",
                    "message": "Conflict",
                    "key": "CONFLICT",
                    "description": "\"indicates that the request could not be completed due to a conflict with the current state of the resource.\"",
                    "spec_title": "RFC7231#6.5.8",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.8"
                },
                "410": {
                    "status": "410",
                    "message": "Gone",
                    "key": "GONE",
                    "description": "\"indicates that access to the target resource is no longer available at the origin server and that this condition is likely to be permanent.\"",
                    "spec_title": "RFC7231#6.5.9",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.9"
                },
                "411": {
                    "status": "411",
                    "message": "Length Required",
                    "key": "LENGTH_REQUIRED",
                    "description": "\"indicates that the server refuses to accept the request without a defined Content-Length.\"",
                    "spec_title": "RFC7231#6.5.10",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.10"
                },
                "412": {
                    "status": "412",
                    "message": "Precondition Failed",
                    "key": "PRECONDITION_FAILED",
                    "description": "\"indicates that one or more preconditions given in the request header fields evaluated to false when tested on the server.\"",
                    "spec_title": "RFC7232#4.2",
                    "spec_href": "https://tools.ietf.org/html/rfc7232#section-4.2"
                },
                "413": {
                    "status": "413",
                    "message": "Payload Too Large",
                    "key": "PAYLOAD_TOO_LARGE",
                    "description": "\"indicates that the server is refusing to process a request because the request payload is larger than the server is willing or able to process.\"",
                    "spec_title": "RFC7231#6.5.11",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.11"
                },
                "414": {
                    "status": "414",
                    "message": "URI Too Long",
                    "key": "URI_TOO_LONG",
                    "description": "\"indicates that the server is refusing to service the request because the request-target is longer than the server is willing to interpret.\"",
                    "spec_title": "RFC7231#6.5.12",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.12"
                },
                "415": {
                    "status": "415",
                    "message": "Unsupported Media Type",
                    "key": "UNSUPPORTED_MEDIA_TYPE",
                    "description": "\"indicates that the origin server is refusing to service the request because the payload is in a format not supported by the target resource for this method.\"",
                    "spec_title": "RFC7231#6.5.13",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.13"
                },
                "416": {
                    "status": "416",
                    "message": "Range Not Satisfiable",
                    "key": "RANGE_NOT_SATISFIABLE",
                    "description": "\"indicates that none of the ranges in the request's Range header field overlap the current extent of the selected resource or that the set of ranges requested has been rejected due to invalid ranges or an excessive request of small or overlapping ranges.\"",
                    "spec_title": "RFC7233#4.4",
                    "spec_href": "https://tools.ietf.org/html/rfc7233#section-4.4"
                },
                "417": {
                    "status": "417",
                    "message": "Expectation Failed",
                    "key": "EXPECTATION_FAILED",
                    "description": "\"indicates that the expectation given in the request's Expect header field could not be met by at least one of the inbound servers.\"",
                    "spec_title": "RFC7231#6.5.14",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.14"
                },
                "418": {
                    "status": "418",
                    "message": "I'm a teapot",
                    "key": "I'M_A_TEAPOT",
                    "description": "\"Any attempt to brew coffee with a teapot should result in the error code 418 I'm a teapot.\"",
                    "spec_title": "RFC2324#2.3.1",
                    "spec_href": "https://tools.ietf.org/html/rfc2324#section-2.3.1"
                },
                "426": {
                    "status": "426",
                    "message": "Upgrade Required",
                    "key": "UPGRADE_REQUIRED",
                    "description": "\"indicates that the server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol.\"",
                    "spec_title": "RFC7231#6.5.15",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.5.15"
                },
                "599": {
                    "status": "599",
                    "message": "**Server Error**",
                    "key": "SERVER_ERROR",
                    "description": "\"indicates that the server is aware that it has erred or is incapable of performing the requested method.\" ~ [*we* fucked up](https://twitter.com/DanaDanger/status/183316183494311936)",
                    "spec_title": "RFC7231#6.6",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.6"
                },
                "500": {
                    "status": "500",
                    "message": "Internal Server Error",
                    "key": "INTERNAL_SERVER_ERROR",
                    "description": "\"indicates that the server encountered an unexpected condition that prevented it from fulfilling the request.\"",
                    "spec_title": "RFC7231#6.6.1",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.6.1"
                },
                "501": {
                    "status": "501",
                    "message": "Not Implemented",
                    "key": "NOT_IMPLEMENTED",
                    "description": "\"indicates that the server does not support the functionality required to fulfill the request.\"",
                    "spec_title": "RFC7231#6.6.2",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.6.2"
                },
                "502": {
                    "status": "502",
                    "message": "Bad Gateway",
                    "key": "BAD_GATEWAY",
                    "description": "\"indicates that the server, while acting as a gateway or proxy, received an invalid response from an inbound server it accessed while attempting to fulfill the request.\"",
                    "spec_title": "RFC7231#6.6.3",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.6.3"
                },
                "503": {
                    "status": "503",
                    "message": "Service Unavailable",
                    "key": "SERVICE_UNAVAILABLE",
                    "description": "\"indicates that the server is currently unable to handle the request due to a temporary overload or scheduled maintenance, which will likely be alleviated after some delay.\"",
                    "spec_title": "RFC7231#6.6.4",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.6.4"
                },
                "504": {
                    "status": "504",
                    "message": "Gateway Time-out",
                    "key": "GATEWAY_TIME-OUT",
                    "description": "\"indicates that the server, while acting as a gateway or proxy, did not receive a timely response from an upstream server it needed to access in order to complete the request.\"",
                    "spec_title": "RFC7231#6.6.5",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.6.5"
                },
                "505": {
                    "status": "505",
                    "message": "HTTP Version Not Supported",
                    "key": "HTTP_VERSION_NOT SUPPORTED",
                    "description": "\"indicates that the server does not support, or refuses to support, the protocol version that was used in the request message.\"",
                    "spec_title": "RFC7231#6.6.6",
                    "spec_href": "https://tools.ietf.org/html/rfc7231#section-6.6.6"
                },
                "102": {
                    "status": "102",
                    "message": "Processing",
                    "key": "PROCESSING",
                    "description": "\"is an interim response used to inform the client that the server has accepted the complete request, but has not yet completed it.\"",
                    "spec_title": "RFC5218#10.1",
                    "spec_href": "https://tools.ietf.org/html/rfc2518#section-10.1"
                },
                "207": {
                    "status": "207",
                    "message": "Multi-Status",
                    "key": "MULTI-STATUS",
                    "description": "\"provides status for multiple independent operations.\"",
                    "spec_title": "RFC5218#10.2",
                    "spec_href": "https://tools.ietf.org/html/rfc2518#section-10.2"
                },
                "226": {
                    "status": "226",
                    "message": "IM Used",
                    "key": "IM_USED",
                    "description": "\"The server has fulfilled a GET request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.\"",
                    "spec_title": "RFC3229#10.4.1",
                    "spec_href": "https://tools.ietf.org/html/rfc3229#section-10.4.1"
                },
                "308": {
                    "status": "308",
                    "message": "Permanent Redirect",
                    "key": "PERMANENT_REDIRECT",
                    "description": "\"The target resource has been assigned a new permanent URI and any future references to this resource outght to use one of the enclosed URIs. [...] This status code is similar to 301 Moved Permanently (Section 7.3.2 of rfc7231), except that it does not allow rewriting the request method from POST to GET.\"",
                    "spec_title": "RFC7538",
                    "spec_href": "https://tools.ietf.org/html/rfc7538"
                },
                "422": {
                    "status": "422",
                    "message": "Unprocessable Entity",
                    "key": "UNPROCESSABLE_ENTITY",
                    "description": "\"means the server understands the content type of the request entity (hence a 415(Unsupported Media Type) status code is inappropriate), and the syntax of the request entity is correct (thus a 400 (Bad Request) status code is inappropriate) but was unable to process the contained instructions.\"",
                    "spec_title": "RFC5218#10.3",
                    "spec_href": "https://tools.ietf.org/html/rfc2518#section-10.3"
                },
                "423": {
                    "status": "423",
                    "message": "Locked",
                    "key": "LOCKED",
                    "description": "\"means the source or destination resource of a method is locked.\"",
                    "spec_title": "RFC5218#10.4",
                    "spec_href": "https://tools.ietf.org/html/rfc2518#section-10.4"
                },
                "424": {
                    "status": "424",
                    "message": "Failed Dependency",
                    "key": "FAILED_DEPENDENCY",
                    "description": "\"means that the method could not be performed on the resource because the requested action depended on another action and that action failed.\"",
                    "spec_title": "RFC5218#10.5",
                    "spec_href": "https://tools.ietf.org/html/rfc2518#section-10.5"
                },
                "428": {
                    "status": "428",
                    "message": "Precondition Required",
                    "key": "PRECONDITION_REQUIRED",
                    "description": "\"indicates that the origin server requires the request to be conditional.\"",
                    "spec_title": "RFC6585#3",
                    "spec_href": "https://tools.ietf.org/html/rfc6585#section-3"
                },
                "429": {
                    "status": "429",
                    "message": "Too Many Requests",
                    "key": "TOO MANY_REQUESTS",
                    "description": "\"indicates that the user has sent too many requests in a given amount of time (\"rate limiting\").\"",
                    "spec_title": "RFC6585#4",
                    "spec_href": "https://tools.ietf.org/html/rfc6585#section-4"
                },
                "431": {
                    "status": "431",
                    "message": "Request Header Fields Too Large",
                    "key": "REQUEST_HEADER_FIELDS_TOO_LARGE",
                    "description": "\"indicates that the server is unwilling to process the request because its header fields are too large.\"",
                    "spec_title": "RFC6585#5",
                    "spec_href": "https://tools.ietf.org/html/rfc6585#section-5"
                },
                "451": {
                    "status": "451",
                    "message": "Unavailable For Legal Reasons",
                    "key": "UNAVAILABLE_FOR_LEGAL_REASONS",
                    "description": "\"This status code indicates that the server is denying access to the resource in response to a legal demand.\"",
                    "spec_title": "draft-ietf-httpbis-legally-restricted-status",
                    "spec_href": "https://tools.ietf.org/html/draft-ietf-httpbis-legally-restricted-status"
                },
                "506": {
                    "status": "506",
                    "message": "Variant Also Negotiates",
                    "key": "VARIANT_ALSO_NEGOTIATES",
                    "description": "\"indicates that the server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.\"",
                    "spec_title": "RFC2295#8.1",
                    "spec_href": "https://tools.ietf.org/html/rfc2295#section-8.1"
                },
                "507": {
                    "status": "507",
                    "message": "Insufficient Storage",
                    "key": "INSUFFICIENT_STORAGE",
                    "description": "\"means the method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.\"",
                    "spec_title": "RFC5218#10.6",
                    "spec_href": "https://tools.ietf.org/html/rfc2518#section-10.6"
                },
                "511": {
                    "status": "511",
                    "message": "Network Authentication Required",
                    "key": "NETWORK_AUTHENTICATION_REQUIRED",
                    "description": "\"indicates that the client needs to authenticate to gain network access.\"",
                    "spec_title": "RFC6585#6",
                    "spec_href": "https://tools.ietf.org/html/rfc6585#section-6"
                },
                "799": {
                    "status": "799",
                    "message": "**Developer Error**",
                    "key": "DEVELOPER_ERROR",
                    "description": "[err](http://www.urbandictionary.com/define.php?term=err)",
                    "spec_title": "7xx-rfc",
                    "spec_href": "http://documentup.com/joho/7XX-rfc"
                }
            },
            unauthorizedTemplateUrl: '/templates/modal/unauthorized.html',
            isUnauthorized: false,
        };

        _this.getMessage = function (error, status) {
            _this.openErrorJson(error, status);
            console.log("error", error, status);
            return;
            if (_this.codes[errorCode]) {
                return _this.codes[errorCode].message;
            } else {
                return _this.codes['403'].message;
            }
        };

        _this.openMessage = function (error, status) {
            _this.openErrorJson(error, status);
            console.log("error", error, status);
            return;
            if (_this.codes[errorCode]) {
                Toast.show(_this.codes[errorCode].message);
            } else {
                Toast.show(_this.codes['403'].message);
            }
        };

        _this.openMessageByCode = function (error, status) {
            _this.openErrorJson(error, status);
            console.log("error", error, status);
            return;
            if (_this.codes[errorCode]) {
                Toast.show(_this.codes[errorCode].message);
            } else {
                Toast.show(_this.codes['403'].message);
            }
        };
        _this.openErrorJson = function (error, status) {
            if (!status && error.status) status = error.status;
            var codeInfo = {};
            if (_this.codes[status]) {
                codeInfo = _this.codes[status];
            } else if (status && _this.codes[status]) {
                codeInfo = _this.codes[status];
            }

            var BAD_REQUEST = _this.searchErrorByKey("BAD_REQUEST");
            var UNAUTHORIZED = _this.searchErrorByKey("UNAUTHORIZED")[0];
            var UNAUTHORIZED_1 = _this.searchErrorByKey("UNAUTHORIZED_1")[0];
            var UNAUTHORIZED_2 = _this.searchErrorByKey("UNAUTHORIZED_2")[0];

            var templateUrl = "";

            if (!status || _this.isUnauthorized) {
                //nothing todo
            } else if (status == BAD_REQUEST.status || status == UNAUTHORIZED.status 　|| status == UNAUTHORIZED_1.status || status == UNAUTHORIZED_2.status) {
                if (_this.isUnauthorize) return;
                templateUrl = _this.unauthorizedTemplateUrl;
                error = UNAUTHORIZED;
                _this.isUnauthorized = true;
                _this.reLogin();
            }


            Modal.error(error, status, codeInfo, templateUrl, _this.isUnauthorized);


        };
        _this.searchErrorByKey = function (key) {
            if (key == 'UNAUTHORIZED') key = 'UNAUTHORIZED_1'
            return $filter('where')(_this.codes, { key: key });
        };
        _this.searchErrorByCode = function (code) {
            if (_this.codes[errorCode]) {
                return _this.codes[errorCode];
            } else {
                return false;
            }
        };
        _this.reLogin = function () {
            // var user = firebase.auth().currentUser;
            // if (!user) return;
            // user.getToken().then(function (idToken) {
            //     Token.find({ token: idToken }).$promise.then(function (_token) {
            //         $sessionStorage.token = _token;
            //         if ($localStorage.setting.enableSaveAuth) $localStorage.setting.token = _token;

            //     }).catch(function (error) {
            //         Error.openMessage(error);
            //     });
            // }).catch(function (error) {
            //     Error.openMessage(error);
            // });
        };

        $rootScope.$on('Error', function (event, data) {
            _this.openErrorJson(data);
        });
        
        return _this;
    });
