package ai.dstack.server.jersey

import ai.dstack.server.jersey.filters.CorsAllowAllRestResponseFilter
import ai.dstack.server.jersey.filters.UriInfoFilter
import ai.dstack.server.jersey.jackson.ObjectMapperContextResolver
import ai.dstack.server.jersey.resources.SupportResources
import ai.dstack.server.jersey.resources.jobs.JobResources
import ai.dstack.server.jersey.resources.stacks.*
import ai.dstack.server.jersey.resources.users.UserResources
import org.glassfish.jersey.CommonProperties
import org.glassfish.jersey.jackson.JacksonFeature
import org.glassfish.jersey.server.ResourceConfig

// TODO: Migrate to Spring Boot (https://search.maven.org/artifact/com.amazonaws.serverless.archetypes/aws-serverless-springboot-archetype/1.0.1/maven-archetype)
class JerseyApplication {
    companion object {
        val resourceConfig: ResourceConfig
            get() = ResourceConfig()
                .property(CommonProperties.FEATURE_AUTO_DISCOVERY_DISABLE, true)
                .property(CommonProperties.METAINF_SERVICES_LOOKUP_DISABLE, true)
                .property(CommonProperties.MOXY_JSON_FEATURE_DISABLE, true)
                .registerClasses(
                    GeneralExceptionMapper::class.java,
                    ObjectMapperContextResolver::class.java,
                    CorsAllowAllRestResponseFilter::class.java,
                    UriInfoFilter::class.java,
                    StackResources::class.java,
                    JobResources::class.java,
                    PermissionResources::class.java,
                    FrameResources::class.java,
                    AttachResources::class.java,
                    DashboardResources::class.java,
                    UserResources::class.java,
                    SupportResources::class.java
                )
                .register(JacksonFeature::class.java)
    }

}