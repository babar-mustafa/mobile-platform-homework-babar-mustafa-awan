package com.mobileplatformhomework

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.io.File
import java.io.FileOutputStream

class AuditLogExportModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String = "AuditLogExport"

    @ReactMethod
    fun exportAuditLog(log: String) {
        try {
            val dir = reactApplicationContext.filesDir
            val fileName = "agent_audit_log_${System.currentTimeMillis()}.txt"
            val file = File(dir, fileName)
            FileOutputStream(file).use { it.write(log.toByteArray(Charsets.UTF_8)) }
        } catch (_: Exception) {
            // Silent fail; could pass to JS via callback
        }
    }
}
