package ai.dstack.server.jersey.resources.payload

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude

// TODO: Add UpdateStackPayload
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
data class CreateStackPayload(
    val user: String?,
    val name: String?,
    val private: Boolean?,
    val readme: String?
)