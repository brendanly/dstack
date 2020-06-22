package ai.dstack.core.backend.resources.status

import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
data class AuthStatus(val session: String, val verified: Boolean)