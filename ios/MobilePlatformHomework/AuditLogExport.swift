import Foundation
import React

@objc(AuditLogExport)
class AuditLogExport: NSObject {
  @objc
  func exportAuditLog(_ log: String) {
    let fileManager = FileManager.default
    guard let documentsURL = fileManager.urls(for: .documentDirectory, in: .userDomainMask).first else { return }
    let fileName = "agent_audit_log_\(Int(Date().timeIntervalSince1970)).txt"
    let fileURL = documentsURL.appendingPathComponent(fileName)
    do {
      try log.write(to: fileURL, atomically: true, encoding: .utf8)
    } catch {
      // Silent fail or could pass to JS via callback
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}
