#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(AuditLogExport, NSObject)

RCT_EXTERN_METHOD(exportAuditLog:(NSString *)log)

@end
