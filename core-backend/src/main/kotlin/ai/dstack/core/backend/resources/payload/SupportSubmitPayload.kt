package ai.dstack.core.backend.resources.payload

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
data class SupportSubmitPayload(
    val email: String?,
    val name: String?,
    val company: String?,
    val message: String?
)